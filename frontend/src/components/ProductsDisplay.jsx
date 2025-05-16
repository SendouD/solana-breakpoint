"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AlertCircle, Copy, Loader2, Plus, ExternalLink, Wallet } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL, clusterApiUrl } from "@solana/web3.js"

const ProductDisplay = () => {
  const [companyName, setCompanyName] = useState("")
  const [products, setProducts] = useState(null)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [balances, setBalances] = useState({})
  const [commissionBalances, setCommissionBalances] = useState({})
  const [SOLAmounts, setSOLAmounts] = useState({})
  const [commissionSOLAmounts, setCommissionSOLAmounts] = useState({})
  const backendapi = import.meta.env.VITE_BACKEND_API

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setProducts(null)
    setBalances({})
    setCommissionBalances({})

    try {
      const response = await axios.get(`${backendapi}/api/get-products/${companyName}`)
      console.log(backendapi)
      console.log(response)
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

  const addSOLToWallet = async (recipientAddress, productName, flag) => {
    if (!window.solana || !window.solana.isPhantom) {
      alert("Phantom is not installed!")
      return
    }

    const SOLAmount = flag === 0 ? SOLAmounts[productName] : commissionSOLAmounts[productName]

    if (!SOLAmount || isNaN(SOLAmount) || Number.parseFloat(SOLAmount) <= 0) {
      alert("Please enter a valid amount of SOL!")
      return
    }

    try {
      // Connect wallet
      const resp = await window.solana.connect()
      const fromWallet = window.solana.publicKey

      const connection = new Connection(clusterApiUrl("devnet"), "confirmed")

      // Build transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: fromWallet,
          toPubkey: new PublicKey(recipientAddress),
          lamports: Number(SOLAmount) * LAMPORTS_PER_SOL,
        }),
      )

      const { blockhash } = await connection.getRecentBlockhash()
      transaction.recentBlockhash = blockhash
      transaction.feePayer = fromWallet

      // Sign transaction
      const signed = await window.solana.signTransaction(transaction)

      // Send transaction
      const signature = await connection.sendRawTransaction(signed.serialize())

      alert("Transaction sent! Waiting for confirmation...")

      // Confirm transaction
      await connection.confirmTransaction(signature, "confirmed")

      alert("Transaction successful!")

      // Reset form
      if (flag === 0) {
        setSOLAmounts((prev) => ({ ...prev, [productName]: "" }))
      } else {
        setCommissionSOLAmounts((prev) => ({ ...prev, [productName]: "" }))
      }
    } catch (error) {
      console.error("Transaction failed:", error)
      if (flag === 0) {
        setSOLAmounts((prev) => ({ ...prev, [productName]: "" }))
      } else {
        setCommissionSOLAmounts((prev) => ({ ...prev, [productName]: "" }))
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
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-50 min-h-screen">
      <div className="container max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="w-full shadow-md border border-gray-200 mb-12">
          <CardHeader className="space-y-1 pb-6 border-b">
            <CardTitle className="text-3xl font-bold tracking-tight text-center">Campaign Display</CardTitle>
            <CardDescription className="text-center text-gray-500">
              Enter your company name to view campaign details and manage wallets.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="companyName" className="text-base font-medium">
                  Company Name
                </Label>
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
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-md transition-all duration-200 ease-in-out transform hover:translate-y-[-2px] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                disabled={isLoading}
                variant="default"
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
              <div className="mt-10 space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold">Campaign Products</h2>
                  <Badge variant="outline" className="px-3 py-1 bg-green-50 text-green-700 border-green-200">
                    {Object.keys(products).length} Active Campaigns
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {Object.entries(products).map(([productName, productData]) => (
                    <Card
                      key={productName}
                      className="overflow-hidden border border-gray-200 shadow-md hover:shadow-lg transition-shadow duration-300"
                    >
                      <CardHeader className="pb-3 border-b">
                        <div className="flex justify-between items-center">
                          <CardTitle className="text-xl font-bold">{productName}</CardTitle>
                          <Badge className="bg-green-100 text-green-800 border-green-200">Active</Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-6 pt-6">
                        <div className="aspect-video relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                          <img
                            src={productData.imageUrl || "/placeholder.svg"}
                            alt={productName}
                            className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          />
                          <a
                            href={productData.productUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute bottom-2 right-2 bg-white/90 text-gray-800 p-2 rounded-full shadow-md hover:bg-white transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-green-50 p-3 rounded-lg border border-green-100">
                            <div className="flex flex-col">
                              <span className="text-xs text-green-700 font-medium">User Reward</span>
                              <span className="text-lg font-bold text-green-800">{productData.userReward} SOL</span>
                            </div>
                          </div>
                          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                            <div className="flex flex-col">
                              <span className="text-xs text-blue-700 font-medium">Website Commission</span>
                              <span className="text-lg font-bold text-blue-800">{productData.websiteCommission}%</span>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                          {/* User Wallet */}
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="font-semibold flex items-center gap-2">
                                <Wallet className="h-4 w-4 text-gray-600" />
                                User Wallet
                              </h3>
                              <div className="flex items-center space-x-2">
                                <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                                  {productData.userwalletAddress.slice(0, 6)}...
                                  {productData.userwalletAddress.slice(-4)}
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
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-sm">
                                Balance:{" "}
                                <span className="font-medium">
                                  {balances[productName] !== undefined ? `${balances[productName]} SOL` : "Loading..."}
                                </span>
                              </p>
                              <div className="flex items-center space-x-2">
                                <Input
                                  type="number"
                                  placeholder="SOL"
                                  value={SOLAmounts[productName] || ""}
                                  onChange={(e) =>
                                    setSOLAmounts((prev) => ({ ...prev, [productName]: e.target.value }))
                                  }
                                  className="w-20 h-8 text-xs"
                                />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 bg-green-50 border-green-200 text-green-700 hover:bg-green-100"
                                  onClick={() => addSOLToWallet(productData.userwalletAddress, productName, 0)}
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  Add
                                </Button>
                              </div>
                            </div>
                          </div>

                          {/* Commission Wallet */}
                          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="font-semibold flex items-center gap-2">
                                <Wallet className="h-4 w-4 text-gray-600" />
                                Commission Wallet
                              </h3>
                              <div className="flex items-center space-x-2">
                                <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                                  {productData.CommissionAddress.slice(0, 6)}...
                                  {productData.CommissionAddress.slice(-4)}
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
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-sm">
                                Balance:{" "}
                                <span className="font-medium">
                                  {commissionBalances[productName] !== undefined
                                    ? `${commissionBalances[productName]} SOL`
                                    : "Loading..."}
                                </span>
                              </p>
                              <div className="flex items-center space-x-2">
                                <Input
                                  type="number"
                                  placeholder="SOL"
                                  value={commissionSOLAmounts[productName] || ""}
                                  onChange={(e) =>
                                    setCommissionSOLAmounts((prev) => ({ ...prev, [productName]: e.target.value }))
                                  }
                                  className="w-20 h-8 text-xs"
                                />
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="h-8 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                                  onClick={() => addSOLToWallet(productData.CommissionAddress, productName, 1)}
                                >
                                  <Plus className="h-3 w-3 mr-1" />
                                  Add
                                </Button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
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
