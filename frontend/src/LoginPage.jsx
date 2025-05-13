import { useState } from 'react';
import { usePrivy } from '@privy-io/react-auth';

const LoginPage = () => {
    const {login} = usePrivy();

    return (
        <div className="login-container">
            <h2>Login Page</h2>
            <button onClick={() => login({loginMethods: ['google']})}>
                Login with email and sms only
            </button>
        </div>
    );
};

export default LoginPage;

//   const { login, logout, authenticated } = usePrivy();

//     return (
//         {
//             (!authenticated) ?
//             <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" onClick={() => login({ loginMethods: ["email", "sms", "google"] })}>
//                 Login
//             </button> :
//             <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded" onClick={() => logout()}>
//                 logout
//             </button>
//         }
//         </div>
//     );