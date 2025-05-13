import React from 'react';
import { usePrivy } from "@privy-io/react-auth";

function Header() {
    const { login, logout, authenticated } = usePrivy();

    return (
        <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
        <h1 className="text-xl font-bold">Summer</h1>

        {
            (!authenticated) ?
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" onClick={() => login({ loginMethods: ["email", "sms", "google"] })}>
                Login
            </button> :
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" onClick={() => logout()}>
                logout
            </button>
        }
        </div>
    );
}

export default Header;
