import { useState, useEffect } from "react"
import axios from "axios"
import { MdExpandMore, MdExpandLess } from "react-icons/md"

const WalletDashboard = () => {
  const [wallets, setWallets] = useState([])
  const [currentWallet, setCurrentWallet] = useState(null)
  const [expandedWallet, setExpandedWallet] = useState(null)
  const [walletDetails, setWalletDetails] = useState({})
  const [showAllWallets, setShowAllWallets] = useState(false)
  const backendapi=import.meta.env.VITE_BACKEND_API

  useEffect(() => {
    getAllWallets()
  }, [])

  const createWallet = async () => {
    try {
      const response = await axios.post(`${backendapi}/create-wallet`)
      setCurrentWallet(response.data)
      getAllWallets()
    } catch (error) {
      console.error("Error creating wallet:", error)
    }
  }

  const getAllWallets = async () => {
    try {
      const response = await axios.get(`${backendapi}/get-all-wallets`)
      setWallets(response.data.data)
    } catch (error) {
      console.error("Error getting wallets:", error)
    }
  }

  const getWalletDetails = async (id) => {
    try {
      const response = await axios.get(`${backendapi}/get-wallet-details/${id}`)
      setWalletDetails((prev) => ({ ...prev, [id]: response.data }))
    } catch (error) {
      console.error("Error getting wallet details:", error)
    }
  }

  const toggleWallet = (id) => {
    if (expandedWallet === id) {
      setExpandedWallet(null)
    } else {
      setExpandedWallet(id)
      if (!walletDetails[id]) {
        getWalletDetails(id)
      }
    }
  }

  const renderWalletCard = (wallet) => (
    <div key={wallet.id} className="mb-4 border rounded-lg overflow-hidden">
      <div
        className="flex justify-between items-center p-4 bg-gray-100 cursor-pointer"
        onClick={() => toggleWallet(wallet.id)}
      >
        <span>
          Wallet: {wallet.address.slice(0, 6)}...{wallet.address.slice(-4)}
        </span>
        <span className="text-sm text-gray-500">{wallet.chain_type}</span>
        {expandedWallet === wallet.id ? <MdExpandLess size={24} /> : <MdExpandMore size={24} />}
      </div>
      {expandedWallet === wallet.id && (
        <div className="p-4 bg-white">  
          {walletDetails[wallet.id] ? (
            <div>
              <p>
                <strong>ID:</strong> {walletDetails[wallet.id].id}
              </p>
              <p>
                <strong>Address:</strong> {walletDetails[wallet.id].address}
              </p>
              <p>
                <strong>Chain Type:</strong> {walletDetails[wallet.id].chain_type}
              </p>
            </div>
          ) : (
            <p>Loading details...</p>
          )}
        </div>
      )}
    </div>
  )

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Wallet Dashboard</h1>
      <button onClick={createWallet} className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Create New Wallet
      </button>

      {currentWallet && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-2">Current Wallet</h2>
          {renderWalletCard(currentWallet)}
        </div>
      )}

      <div className="mb-4">
        <button
          onClick={() => setShowAllWallets(!showAllWallets)}
          className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 flex items-center"
        >
          {showAllWallets ? "Hide All Wallets" : "Show All Wallets"}
          {showAllWallets ? <MdExpandLess size={24} /> : <MdExpandMore size={24} />}
        </button>
      </div>

      {showAllWallets && (
        <div>
          <h2 className="text-xl font-semibold mb-2">All Wallets</h2>
          {wallets.map(renderWalletCard)}
        </div>
      )}
    </div>
  )
}

export default WalletDashboard