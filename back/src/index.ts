import express, { Request, Response } from "express";
import dotenv from "dotenv";
import getAuthorizationSignature from "./utils/AuthSign";
import { PrivyClient } from "@privy-io/server-auth";
import mongoose from "mongoose";
import Company from "./schema/companyschema";
import cors from "cors";
import postPolicy from "./utils/policy";
import createWallet from "./utils/createWallet";
import sendSOLTransaction from "./utils/sendTransaction";
import axios from "axios";
import * as fs from 'fs';
import multer from "multer";
import FormData from "form-data";
import updatePolicy from "./utils/updatePolicy";
import sendwebtransaction from "./utils/sendwebsiteTransaction";
import { Connection, PublicKey, clusterApiUrl, LAMPORTS_PER_SOL } from '@solana/web3.js';

const upload = multer();
const allowedOrigin = process.env.FRONTEND_URL;
dotenv.config();
mongoose.connect(process.env.MONGO_URI || "");

const db = mongoose.connection;

db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

const privy = new PrivyClient(
  process.env.PRIVY_APP_ID || "",
  process.env.PRIVY_APP_SECRET || "",
  {
    walletApi: {
      authorizationPrivateKey: process.env.PRIVY_AUTHORIZATION_PRIVATE_KEY,
    },
  }
);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use((req: Request, res: Response, next): any => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});
app.use(express.static("public"));
app.get("/advertisement.js", (req, res) => {
  res.setHeader("Content-Type", "application/javascript");
  res.sendFile(__dirname + "/public/advertisement.js");
});

interface ClickRequestBody {
  userAddress: string;
  companyName: string;
  redirectUrl: string;
  product: string;
  websiteAddress:string;

}

app.post("/api/track-click", async (req: Request<{}, {}, ClickRequestBody>, res: Response): Promise<void> => {
  try {
      const { userAddress, companyName, redirectUrl, product, websiteAddress} = req.body;
      console.log("website address: ", websiteAddress);
      if (!userAddress) {
          res.status(400).json({ error: "User address is required" });
          return;
      }

      console.log("here");
      console.log("here" + companyName);

      let company = await Company.findOne({ companyName: companyName });
      
      if (!company) {
        console.log("no company found");
        res.status(404).json({ error: "Company not found" });
        return;
      }
  
      const productData = company.products?.get(product);
  
      if (!productData) {
        console.log("no product data found");
        res.status(404).json({ error: "Product not found" });
        return;
      }
  
      if (productData.productUrl !== redirectUrl) {
        console.log("redirectUrl != productData.productUrl");
        res.status(400).json({ error: "Redirect URL does not match the product URL" });
        return;
      }

      const userAdKey = `${userAddress}-${productData.userwalletUniqueId}`;
      //USER REWARDD
      await sendSOLTransaction(productData.userwalletUniqueId, {
        to: userAddress,
        value: productData.userReward,
        from:productData.userwalletAddress
      }, userAdKey);
      console.log("hitt");
      const websiteReward=(productData.userReward*productData.websiteCommission)/100;
      console.log("hitttt")
      const webAdKey = `${websiteAddress}-${userAddress}-${productData.commissionUniqueId}`;
      //COMMISSION REWARD
      await sendSOLTransaction(productData.commissionUniqueId, {
        to: websiteAddress,
        value: websiteReward,
        from:productData.CommissionAddress
      },webAdKey);
      console.log(`User ${userAddress} clicked on ad (ID: ${companyName}, Product: ${product}, URL: ${redirectUrl}).`);

      res.json({ message: "Click tracked, incentive processed.", user: userAddress });
  } catch (error) {
      res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/api/create-wallet", async (req: Request, res: Response): Promise<any> => {
  try {
    const { companyName, product, productUrl, imageUrl,userReward,websiteCommission} = req.body;
  
    let company = await Company.findOne({ companyName });
    if (!company) {
      return res.status(404).json("company not found");
    }
    if(!product||!productUrl||!imageUrl||!userReward||!websiteCommission){
      return res.status(404).json("parameters missing")
    }

    if (company && company.products && company.products.has(product)) {
      return res.status(400).json({
        message: `Wallet already exists for product "${product}".`,
        walletAddress: company.products.get(product),
      });
    }
    //userwallet creation
    const userpolicyIds= await postPolicy(userReward);
    console.log("Policy ID:", userpolicyIds);
    const userwallet = await createWallet(userpolicyIds);
    if (!userwallet) {
      throw new Error("Failed to create wallet");
    }
    const { id:userwalletUniqueId, address:userAddress } = userwallet;
    console.log("user Wallet created:", userwalletUniqueId, userAddress, companyName, product, productUrl);
    //commsion wallet crreation
    const commissionpolicyId= await postPolicy(userReward);
    console.log("Policy ID:", userpolicyIds);
    const Commissionwallet = await createWallet(userpolicyIds);
    if (!userwallet) {
      throw new Error("Failed to create wallet");
    }
    if (!Commissionwallet) {
      throw new Error("Failed to create commission wallet");
    }
    const { id:commissionUniqueId, address:CommissionAddress } = Commissionwallet;
    console.log("user Wallet created:", userwalletUniqueId, userAddress, companyName, product, productUrl);


    if (company && company.products) {
      company.products.set(product, {
        productUrl, userwalletUniqueId: userwalletUniqueId, userpolicyId: userpolicyIds, imageUrl, userwalletAddress: userAddress, userReward, websiteCommission,
        CommissionAddress: CommissionAddress,
        commissionUniqueId: commissionUniqueId,
        commissionpolicyId: commissionpolicyId
      });
      await company.save();
    }
    return res.status(200).json({ message: "Wallet created successfully!" });

  } catch (error) {
    console.error("Error creating wallet:", error);
    res.status(500).json({ error: "Failed to create wallet" });
  }
});

app.post("/api/create-company", async (req: Request, res: Response): Promise<any> => {
  try {
    const { companyName } = req.body;

    // Check if the company already exists
    let company = await Company.findOne({ companyName });
    if (company) {
      return res.status(400).json({ message: "Company already exists" });
    }

    // Create a new company
    company = new Company({
      companyName,
      products: new Map(), // Initialize with an empty products map
    });

    await company.save(); // Save the company to the database

    return res.status(201).json({ message: "Company created successfully", company });
  } catch (error) {
    console.error("Error creating company:", error);
    return res.status(500).json({ error: "Failed to create company" });
  }
});

app.get("/api/get-products/:companyName", async (req: Request, res: Response): Promise<any> => {
  try {
    const { companyName } = req.params;

    console.log(companyName);

    let company = await Company.findOne({ companyName }).lean();
    if (!company) {
      return res.status(400).json({ message: "Company doesn't exist" });
    }

    const filteredProducts: Record<string, any> = {};
    if (company.products) {
      for (const [key, product] of Object.entries(company.products)) {
        const {userwalletUniqueId, userpolicyId,commissionpolicyId,commissionUniqueId,...filteredProduct } = product;
        filteredProducts[key] = filteredProduct;
      }
    }

    return res.status(200).json({ 
      message: "Products fetched successfully!", 
      company: { ...company, products: filteredProducts } 
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ error: "Failed to fetch products" });
  }
});

app.get("/api/get-products", async (req: Request, res: Response): Promise<any> => {
  try {
    const companies = await Company.find({}).lean();

    if (!companies || companies.length === 0) {
      return res.status(400).json({ message: "No companies exist" });
    }

    const result = companies.map((company) => {
      const filteredProducts: Record<string, any> = {};

      if (company.products && typeof company.products === "object") {
        for (const [key, product] of Object.entries(company.products)) {
          const {
            userwalletUniqueId,
            userpolicyId,
            commissionpolicyId,
            commissionUniqueId,
            ...filteredProduct
          } = product as any;

          filteredProducts[key] = filteredProduct;
        }
      }

      return {
        companyName: company.companyName,
        products: filteredProducts,
      };
    });

    return res.status(200).json({
      message: "Products fetched successfully!",
      data: result,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ error: "Failed to fetch products" });
  }
});

app.get("/api/get-balance/:walletAddress", async (req: Request, res: Response): Promise<any> => {
  try {
    const { walletAddress } = req.params;

    // Validate the public key format
    let pubkey: PublicKey;
    try {
      pubkey = new PublicKey(walletAddress);
      if (!PublicKey.isOnCurve(pubkey.toBuffer())) {
        throw new Error("Invalid public key");
      }
    } catch (e) {
      console.log(e);
      return res.status(400).json({ error: "Invalid Solana wallet address" });
    }

    // Create connection to Solana cluster (change to 'mainnet-beta' if needed)
    const connection = new Connection(clusterApiUrl('devnet'), 'confirmed');

    // Fetch balance in lamports
    const balanceLamports = await connection.getBalance(pubkey);

    // Convert to SOL
    const balanceInSOL = balanceLamports / LAMPORTS_PER_SOL;

    return res.status(200).json({
      address: walletAddress,
      balance: balanceInSOL.toString(),
    });

  } catch (error) {
    console.error("Error fetching Solana balance:", error);
    return res.status(500).json({ error: "Failed to fetch balance" });
  }
});

app.patch("/api/update-policy",async(req: Request, res: Response): Promise<any>=>{
  try{
    const {policyId}=req.body;
    await updatePolicy(policyId);
    return res.status(200).json("updated successfully")}catch(error){
      console.log("error",error);
    } 
})

app.get("/api/test", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Test route",
  });
})

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

module.exports = app;