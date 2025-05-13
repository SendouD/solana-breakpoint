import { useState, useEffect } from "react"
import axios from "axios"
import { ethers } from "ethers"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AlertCircle, Copy, Loader2, Plus, ChevronDown, ChevronUp } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
const backendapi=import.meta.env.VITE_BACKEND_API

function CampaignCard({ productName, productData, balance, commissionBalance, companyName, websiteAddress }) {
  const [isOpen, setIsOpen] = useState(false);

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
</script>`;

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

export default AdComponent;`;

    return { htmlSnippet, reactSnippet };
  };

  const copyToClipboard = (text, message = "Copied to clipboard!") => {
    navigator.clipboard.writeText(text).then(
      () => {
        alert(message);
      },
      (err) => {
        console.error("Could not copy text: ", err);
      }
    );
  };

  const { htmlSnippet, reactSnippet } = generateSnippet(productName, productData);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="space-y-4">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4">
            <h3 className="text-2xl font-bold">{productName}</h3>
       
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col lg:flex-row gap-4 ">
          <img
            src={productData.imageUrl || "/placeholder.svg"}
            alt={productName}
            className="rounded-lg w-full h-auto object-cover"
            style={{ maxWidth: "400px", maxHeight: "350px" }}
          />
          <div className="space">
            <div className="grid grid-cols-1 gap">
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="font-bold">User incentives:</span> {productData.userReward}
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="font-bold">Website commission:</span> {productData.websiteCommission}
              </div>
              <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <span className="font-bold">Campaign URL:</span> {productData.productUrl}
              </div>
            </div>
          </div>
        </div>
        <div className="space-y-4 w-full lg:w-auto">
              {/* User Reward Wallet Section */}
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">User Reward Wallet</span>
                    <div className="flex items-center">
                      <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">
                        {productData.userwalletAddress.slice(0, 6)}...{productData.userwalletAddress.slice(-4)}
                      </code>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="ml-2"
                              onClick={() => copyToClipboard(productData.userwalletAddress)}
                            >
                              <Copy className="h-4 w-4" />
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
                    Balance: <span className="font-medium">{balance !== undefined ? `${balance} ETH` : "Loading..."}</span>
                  </div>
                </div>
              </div>

              {/* Commission Address Section */}
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">Commission Address</span>
                    <div className="flex items-center">
                      <code className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-xs">
                        {productData.CommissionAddress.slice(0, 6)}...{productData.CommissionAddress.slice(-4)}
                      </code>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="ml-2"
                              onClick={() => copyToClipboard(productData.CommissionAddress)}
                            >
                              <Copy className="h-4 w-4" />
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
                    Balance: <span className="font-medium">{commissionBalance !== undefined ? `${commissionBalance} ETH` : "Loading..."}</span>
                  </div>
                </div>
              </div>
            </div>

        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-full bg-green-600 hover:bg-green-700 text-white"
        >
          {isOpen ? (
            <>
              <ChevronUp className="mr-2 h-4 w-4" />
              Hide Snippets
            </>
          ) : (
            <>
              <ChevronDown className="mr-2 h-4 w-4" />
              Show Snippets
            </>
          )}
        </Button>

        {isOpen && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-2">HTML Embed:</h3>
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
                {htmlSnippet}
              </pre>
              <Button
                onClick={() => copyToClipboard(htmlSnippet)}
                className="mt-2 bg-green-600 hover:bg-green-700 text-white"
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy HTML Snippet
              </Button>
            </div>

            <div>
              <h3 className="text-lg font-medium mb-2">React Embed:</h3>
              <pre className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg overflow-x-auto text-sm">
                {reactSnippet}
              </pre>
              <Button
                onClick={() => copyToClipboard(reactSnippet)}
                className="mt-2 bg-green-600 hover:bg-green-700 text-white"
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy React Snippet
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function Campaigns() {
  const [companyName, setCompanyName] = useState("")
  const [websiteAddress, setWebsiteAddress] = useState("")
  const [products, setProducts] = useState(null)
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [balances, setBalances] = useState({})
  const [commissionBalances, setCommissionBalances] = useState({})

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setProducts(null)
    setBalances({})
    setCommissionBalances({})

    try {
      const response = await axios.get(`${backendapi}/api/get-products/${companyName}`)
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
        getBalance(productData.userwalletAddress, productName, 'user')
        getBalance(productData.CommissionAddress, productName, 'commission')
      })
    }
  }, [products])

  const getBalance = async (address, productName, type) => {
    try {
      const response = await axios.get(`${backendapi}/api/get-balance/${address}`)
      if (type === 'user') {
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
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="w-full max-w-3xl mx-auto shadow-lg mb-8">
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
              <div className="space-y-2">
                <Label htmlFor="websiteAddress">Your wallet address:</Label>
                <Input
                  type="text"
                  id="websiteAddress"
                  value={websiteAddress}
                  onChange={(e) => setWebsiteAddress(e.target.value)}
                  required
                  placeholder="Enter your wallet address"
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
          </CardContent>
        </Card>

        {products && (
          <div className="mt-6">
            <h2 className="text-2xl font-semibold mb-4 text-center">Campaign Snippets</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
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
  );
}