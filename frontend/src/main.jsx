import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {PrivyProvider} from '@privy-io/react-auth';
import {SmartWalletsProvider} from '@privy-io/react-auth/smart-wallets';
import './index.css'
import App from './App.jsx'
import Header from './Header.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PrivyProvider
      appId="cm6o64x8s01apu0vkxgr2r1h8"
      config={{
        embeddedWallets: { 
          ethereum: { 
            createOnLogin: 'users-without-wallets',
          }, 
        }, 
      }}
    >
      <SmartWalletsProvider>
        {/* <Header /> */}
        <App />
      </SmartWalletsProvider>
    </PrivyProvider>
  </StrictMode>,
)
