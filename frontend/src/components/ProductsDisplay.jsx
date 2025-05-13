import { useState, useEffect } from "react"
import axios from "axios"
import { ethers } from "ethers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AlertCircle, Copy, Loader2, Plus } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const ProductDisplay = () => {
  const [companyName, setCompanyName] = useState("")
  const [products, setProducts] = useState(null)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [balances, setBalances] = useState({})
  const [commissionBalances, setCommissionBalances] = useState({})
  const [ethAmounts, setEthAmounts] = useState({})
  const [commissionEthAmounts, setCommissionEthAmounts] = useState({})
  const backendapi = import.meta.env.VITE_BACKEND_API

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setProducts(null)
    setBalances({})
    setCommissionBalances({})
    console.log

    try {
      const response = await axios.get(`${backendapi}/api/get-products/${companyName}`)
      console.log(backendapi);
      console.log(response);
      setProducts(response.data.company.products)
    } catch (error) {
      console.log(error)
      setError("Failed to fetch products. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (products) {
      Object.entries(products).forEach(([productName, productData]) => {
        getBalance(productData.userwalletAddress, productName, 0)
        getBalance(productData.CommissionAddress, productName, 1)
      })
    }
  }, [products])

  const getBalance = async (userwalletAddress, productName, flag) => {
    try {
      const response = await axios.get(`${backendapi}/api/get-balance/${userwalletAddress}`)
      if (flag === 0) {
        setBalances((prev) => ({ ...prev, [productName]: response.data.balance }))
      } else {
        setCommissionBalances((prev) => ({ ...prev, [productName]: response.data.balance }))
      }
    } catch (error) {
      console.log(error)
      setError("Failed to fetch balance. Please try again.")
    }
  }

  const addEthToWallet = async (recipientAddress, productName, flag) => {
    if (!window.ethereum) {
      alert("MetaMask is not installed!")
      return
    }

    const ethAmount = flag === 0 ? ethAmounts[productName] : commissionEthAmounts[productName]

    if (!ethAmount || isNaN(ethAmount) || Number.parseFloat(ethAmount) <= 0) {
      alert("Please enter a valid amount of ETH!")
      return
    }

    try {
      await window.ethereum.request({ method: "eth_requestAccounts" })

      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const tx = await signer.sendTransaction({
        to: recipientAddress,
        value: ethers.parseEther(ethAmount),
      })

      alert("Transaction sent! Waiting for confirmation...")

      await tx.wait()

      alert("Transaction successful!")
      if (flag === 0) {
        setEthAmounts((prev) => ({ ...prev, [productName]: "" }))
      } else {
        setCommissionEthAmounts((prev) => ({ ...prev, [productName]: "" }))
      }
    } catch (error) {
      console.error("Transaction failed:", error)
      if (flag === 0) {
        setEthAmounts((prev) => ({ ...prev, [productName]: "" }))
      } else {
        setCommissionEthAmounts((prev) => ({ ...prev, [productName]: "" }))
      }
      alert(`Transaction failed!\nError: ${error.message}`)
    }
  }

  const copyToClipboard = (text, message = "Copied to clipboard!") => {
    navigator.clipboard.writeText(text).then(
      () => {
        alert(message)
      },
      (err) => {
        console.error("Could not copy text: ", err)
      },
    )
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="w-full shadow-lg">
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold tracking-tight text-center">Campaign Display</CardTitle>
            <CardDescription className="text-center text-gray-500 dark:text-gray-400">
              Enter your company name to view campaign snippets.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  type="text"
                  id="companyName"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                  placeholder="Enter company name"
                  className="w-full"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Fetching Campaigns...
                  </>
                ) : (
                  "Submit"
                )}
              </Button>
            </form>

            {error && (
              <Alert variant="destructive" className="mt-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {products && (
              <div className="mt-6 space-y-4">
                <h2 className="text-xl font-semibold mb-2">Campaign Products:</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {Object.entries(products).map(([productName, productData]) => (
                    <Card key={productName} className="overflow-hidden">
                      <CardHeader>
                        <CardTitle className="text-2xl mb-2">{productName}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="aspect-video relative overflow-hidden rounded-lg">
                          <img
                            src={productData.imageUrl || "/placeholder.svg"}
                            alt={productName}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h3 className="font-semibold mb-2">User Wallet</h3>
                            <div className="flex items-center space-x-2">
                              <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">
                                {productData.userwalletAddress.slice(0, 6)}...{productData.userwalletAddress.slice(-4)}
                              </code>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() =>
                                        copyToClipboard(productData.userwalletAddress, "Wallet address copied!")
                                      }
                                    >
                                      <Copy className="h-4 w-4" />
                                      <span className="sr-only">Copy wallet address</span>
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Copy wallet address</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <p className="text-sm mt-1">
                              Balance:{" "}
                              {balances[productName] !== undefined ? `${balances[productName]} ETH` : "Loading..."}
                            </p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Input
                                type="number"
                                placeholder="ETH amount"
                                value={ethAmounts[productName] || ""}
                                onChange={(e) => setEthAmounts((prev) => ({ ...prev, [productName]: e.target.value }))}
                                className="w-24"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addEthToWallet(productData.userwalletAddress, productName, 0)}
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Add ETH
                              </Button>
                            </div>
                          </div>
                          <div>
                            <h3 className="font-semibold mb-2">Commission Wallet</h3>
                            <div className="flex items-center space-x-2">
                              <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">
                                {productData.CommissionAddress.slice(0, 6)}...{productData.CommissionAddress.slice(-4)}
                              </code>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      onClick={() =>
                                        copyToClipboard(productData.CommissionAddress, "Commission address copied!")
                                      }
                                    >
                                      <Copy className="h-4 w-4" />
                                      <span className="sr-only">Copy commission address</span>
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Copy commission address</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                            <p className="text-sm mt-1">
                              Balance:{" "}
                              {commissionBalances[productName] !== undefined
                                ? `${commissionBalances[productName]} ETH`
                                : "Loading..."}
                            </p>
                            <div className="flex items-center space-x-2 mt-2">
                              <Input
                                type="number"
                                placeholder="ETH amount"
                                value={commissionEthAmounts[productName] || ""}
                                onChange={(e) =>
                                  setCommissionEthAmounts((prev) => ({ ...prev, [productName]: e.target.value }))
                                }
                                className="w-24"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => addEthToWallet(productData.CommissionAddress, productName, 1)}
                              >
                                <Plus className="h-4 w-4 mr-1" />
                                Add ETH
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <p className="text-sm text-gray-500">
                          User Reward: {productData.userReward} ETH | Website Commission:{" "}
                          {productData.websiteCommission}%
                        </p>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

export default ProductDisplay