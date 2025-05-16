"use client"

import { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AlertCircle, Copy, Loader2, ChevronDown, ChevronUp, ExternalLink } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"

const backendapi = import.meta.env.VITE_BACKEND_API

function CampaignCard({ productName, productData, balance, commissionBalance, companyName, websiteAddress }) {
  const [isOpen, setIsOpen] = useState(false)

  const generateSnippet = (productName, productData) => {
    const htmlSnippet = `<script async src="${backendapi}/advertisement.js" 
  data-ad-image="${productData.imageUrl}" 
  data-ad-width="400px" 
  data-ad-height="350px" 
  data-ad-id="${companyName}" 
  redirect-url="${productData.productUrl}" 
  product="${productName}"
  website-wallet-address="${websiteAddress}"
>
</script>`

    const reactSnippet = `import React, { useRef, useEffect } from "react";

const AdComponent = () => {
  const adRef = useRef(null);
  const hasRun = useRef(false);

  useEffect(() => {
      if (!adRef.current || hasRun.current) return;
      hasRun.current = true;

      const script = document.createElement("script");
      script.src = "${backendapi}/advertisement.js";
      script.async = true;

      script.setAttribute("data-ad-image", "${productData.imageUrl}");
      script.setAttribute("data-ad-width", "400px");
      script.setAttribute("data-ad-height", "350px");
      script.setAttribute("data-ad-id", "${companyName}");
      script.setAttribute("redirect-url", "${productData.productUrl}");
      script.setAttribute("product", "${productName}");
      script.setAttribute("website-wallet-address", "${websiteAddress}");

      adRef.current.appendChild(script);
  }, []);

  return <div ref={adRef} id="ad-container"></div>;
};

export default AdComponent;`

    return { htmlSnippet, reactSnippet }
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

  const { htmlSnippet, reactSnippet } = generateSnippet(productName, productData)

  return (
    <Card className="w-full border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-300">
      <CardHeader className="pb-3">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4">
          <div>
            <CardTitle className="text-2xl font-bold">{productName}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                Active
              </Badge>
              <a
                href={productData.productUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                <ExternalLink className="h-3 w-3" />
                View Campaign
              </a>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="lg:w-2/5">
            <div className="relative overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
              <img
                src={productData.imageUrl || "/placeholder.svg"}
                alt={productName}
                className="w-full h-auto object-cover aspect-[4/3]"
                style={{ maxWidth: "400px" }}
              />
            </div>
          </div>
          <div className="lg:w-3/5 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-green-50 rounded-lg border border-green-100">
                <span className="font-medium text-green-800">User incentives:</span>
                <span className="ml-2 font-bold text-green-900">{productData.userReward}</span>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <span className="font-medium text-blue-800">Website commission:</span>
                <span className="ml-2 font-bold text-blue-900">{productData.websiteCommission}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* User Reward Wallet Section */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">User Reward Wallet</span>
                    <div className="flex items-center">
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                        {productData.userwalletAddress.slice(0, 6)}...{productData.userwalletAddress.slice(-4)}
                      </code>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="ml-2 h-7 w-7"
                              onClick={() => copyToClipboard(productData.userwalletAddress)}
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Copy user wallet address</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <div className="text-sm">
                    Balance:{" "}
                    <span className="font-medium">{balance !== undefined ? `${balance} SOL` : "Loading..."}</span>
                  </div>
                </div>
              </div>

              {/* Commission Address Section */}
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">Commission Address</span>
                    <div className="flex items-center">
                      <code className="bg-gray-100 px-2 py-1 rounded text-xs font-mono">
                        {productData.CommissionAddress.slice(0, 6)}...{productData.CommissionAddress.slice(-4)}
                      </code>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="ml-2 h-7 w-7"
                              onClick={() => copyToClipboard(productData.CommissionAddress)}
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>Copy commission address</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                  <div className="text-sm">
                    Balance:{" "}
                    <span className="font-medium">
                      {commissionBalance !== undefined ? `${commissionBalance} SOL` : "Loading..."}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
          variant="default"
        >
          {isOpen ? (
            <>
              <ChevronUp className="mr-2 h-4 w-4" />
              Hide Embed Snippets
            </>
          ) : (
            <>
              <ChevronDown className="mr-2 h-4 w-4" />
              Show Embed Snippets
            </>
          )}
        </Button>

        {isOpen && (
          <div className="space-y-6 mt-4">
            <Tabs defaultValue="html" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="html">HTML Embed</TabsTrigger>
                <TabsTrigger value="react">React Component</TabsTrigger>
              </TabsList>
              <TabsContent value="html" className="mt-4">
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono">
                  <pre className="whitespace-pre-wrap">{htmlSnippet}</pre>
                </div>
                <Button
                  onClick={() => copyToClipboard(htmlSnippet)}
                  className="mt-2 bg-green-600 hover:bg-green-700 text-white"
                  variant="default"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy HTML Snippet
                </Button>
              </TabsContent>
              <TabsContent value="react" className="mt-4">
                <div className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm font-mono">
                  <pre className="whitespace-pre-wrap">{reactSnippet}</pre>
                </div>
                <Button
                  onClick={() => copyToClipboard(reactSnippet)}
                  className="mt-2 bg-green-600 hover:bg-green-700 text-white"
                  variant="default"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy React Snippet
                </Button>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export default function Campaigns() {
  const [companyName, setCompanyName] = useState("")
  const [websiteAddress, setWebsiteAddress] = useState("")
  const [products, setProducts] = useState(null)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [balances, setBalances] = useState({})
  const [commissionBalances, setCommissionBalances] = useState({})
  const [viewMode, setViewMode] = useState("search") // "search" or "all"

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setProducts(null)
    setBalances({})
    setCommissionBalances({})

    try {
      const response = await axios.get(`${backendapi}/api/get-products/${companyName}`)
      if (response.data && response.data.company && response.data.company.products) {
        console.log(response.data.company.products);
        setProducts(response.data.company.products)
      } else {
        setError("No products found for this company.")
      }
    } catch (error) {
      console.log(error)
      setError("Failed to fetch products. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAllCampaigns = async () => {
    setIsLoading(true)
    setError("")
    setProducts(null)
    setBalances({})
    setCommissionBalances({})

    try {
      const response = await axios.get(`${backendapi}/api/get-products`)

      console.log(response);

      if (response.data && response.data.data && Array.isArray(response.data.data)) {
        const allProducts = {}
        
        response.data.data.forEach(company => {
          if (company.products && Object.keys(company.products).length > 0) {
            Object.keys(company.products).forEach(productKey => {
              allProducts[productKey] = {
                ...company.products[productKey],
                companyName: company.companyName
              }
            })
          }
        })
        
        setProducts(allProducts)
      } else {
        setError("No campaigns found.")
      }
    } catch (error) {
      console.log(error)
      setError("Failed to fetch campaigns. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (products) {
      Object.entries(products).forEach(([productName, productData]) => {
        getBalance(productData.userwalletAddress, productName, "user")
        getBalance(productData.CommissionAddress, productName, "commission")
      })
    }
  }, [products])

  useEffect(() => {
    if (viewMode === "all") {
      fetchAllCampaigns()
    }
  }, [viewMode])

  const getBalance = async (address, productName, type) => {
    try {
      const response = await axios.get(`${backendapi}/api/get-balance/${address}`)
      if (type === "user") {
        setBalances((prev) => ({ ...prev, [productName]: response.data.balance }))
      } else {
        setCommissionBalances((prev) => ({ ...prev, [productName]: response.data.balance }))
      }
    } catch (error) {
      console.log(error)
      setError(`Failed to fetch ${type} balance. Please try again.`)
    }
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-3xl mx-auto shadow-md border border-gray-200 mb-12">
          <CardHeader className="space-y-1 pb-6 border-b">
            <CardTitle className="text-3xl font-bold tracking-tight text-center">Campaign Display</CardTitle>
            <CardDescription className="text-center text-gray-500">
              Enter your company name to view campaign snippets.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div className="flex justify-center mb-4">
                <div className="bg-gray-100 p-1 rounded-lg inline-flex">
                  <button
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      viewMode === "search" ? "bg-white shadow-sm text-gray-900" : "text-gray-600 hover:text-gray-900"
                    }`}
                    onClick={() => setViewMode("search")}
                  >
                    Search by Company
                  </button>
                  <button
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                      viewMode === "all" ? "bg-white shadow-sm text-gray-900" : "text-gray-600 hover:text-gray-900"
                    }`}
                    onClick={() => setViewMode("all")}
                  >
                    View All Campaigns
                  </button>
                </div>
              </div>

              {viewMode === "search" ? (
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
                  <div className="space-y-2">
                    <Label htmlFor="websiteAddress" className="text-base font-medium">
                      Your wallet address:
                    </Label>
                    <Input
                      type="text"
                      id="websiteAddress"
                      value={websiteAddress}
                      onChange={(e) => setWebsiteAddress(e.target.value)}
                      required
                      placeholder="Enter your wallet address"
                      className="w-full font-mono"
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
              ) : (
                <div className="text-center">
                  {isLoading ? (
                    <div className="flex justify-center items-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-green-600" />
                      <span className="ml-2 text-lg">Loading all campaigns...</span>
                    </div>
                  ) : (
                    <p className="text-gray-600">Showing all available campaigns</p>
                  )}
                </div>
              )}
            </div>

            {error && (
              <Alert variant="destructive" className="mt-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {products && (
          <div className="mt-6">
            <h2 className="text-3xl font-bold mb-8 text-center">
              {viewMode === "search" ? "Campaign Snippets" : "All Available Campaigns"}
            </h2>
            <div className="grid grid-cols-1 gap-8">
              {Object.entries(products).map(([productName, productData]) => (
                <CampaignCard
                  key={productName}
                  productName={productName}
                  productData={productData}
                  balance={balances[productName]}
                  commissionBalance={commissionBalances[productName]}
                  companyName={companyName}
                  websiteAddress={websiteAddress}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
