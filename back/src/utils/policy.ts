import axios from "axios";
import * as fs from "fs";
import dotenv from 'dotenv';
import getAuthorizationSignature from "./AuthSign";
dotenv.config();
import { parseEther } from 'viem'

export default async function postPolicy(userReward:Number) {
    console.log("Creating policy...");
    const privyAppId = process.env.PRIVY_APP_ID;
    const privyAppSecret = process.env.PRIVY_APP_SECRET;
    console.log("Privy App ID:", privyAppId);

    // Base64 encode for basic authentication
    const authHeader = 'Basic ' + Buffer.from(`${privyAppId}:${privyAppSecret}`).toString('base64');

    const url = 'https://api.privy.io/v1/policies';
    const value=parseEther(String(userReward));
    console.log(value);
    // 10000000000000000n
    // Read policy from file
   const policyData = {
    "version": "1.0",
    "name": "SOL transfer maximums",
    "chain_type": "solana",
    "rules": [{
        "name": "Restrict SOL transfers to a maximum value",
        "method": "signAndSendTransaction",
        "conditions": [
            {
                // This field_source is used for all System Program instructions.
                "field_source": "solana_system_program_instruction",
                "field": "Transfer.lamports",
                "operator": "lte",
                "value": "100000000" // 0.1 SOL 
            }
        ],
        "action": "ALLOW"
    }]
}
    // Prepare headers
    const method='POST'
    const headers = {
        'privy-app-id': privyAppId,
        'Content-Type': 'application/json',
        'Authorization': authHeader,
        'privy-authorization-signature': getAuthorizationSignature({url, body: policyData,method})
    };

    try {
        // Send the POST request
        const response = await axios.post(url, policyData, { headers });

        const policy = response.data;

        console.log('Policy created successfully!');

        return policy.id;
    } catch (error) {
        const errorMessage = (error as any).message;
        console.error('Error creating policy:', errorMessage);
        throw error;
    }
}
