"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AlertCircle, Calendar, DollarSign, Percent, LinkIcon, ImageIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default function AddProduct() {
  const [companyName, setCompanyName] = useState("")
  const [productName, setProductName] = useState("")
  const [productUrl, setProductUrl] = useState("")
  const [message, setMessage] = useState("")
  const [file, setFile] = useState(null)
  const [userReward, setUserReward] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [websiteCommission, setWebsiteCommission] = useState(0)
  const [error, setError] = useState("")
  const [date, setDate] = useState("")
  const [previewUrl, setPreviewUrl] = useState("")

  const backendapi = import.meta.env.VITE_BACKEND_API

  useEffect(() => {
    console.log(import.meta.env.VITE_BACKEND_API)
  }, [])

  useEffect(() => {
    // Create preview URL for the selected image
    if (file) {
      const objectUrl = URL.createObjectURL(file)
      setPreviewUrl(objectUrl)

      // Free memory when component unmounts
      return () => URL.revokeObjectURL(objectUrl)
    }
  }, [file])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setMessage("")

    try {
      const imageUrl = await handleImageUpload()
      const response = await axios.post(`${backendapi}/api/create-wallet`, {
        companyName,
        product: productName,
        productUrl,
        imageUrl,
        userReward,
        websiteCommission,
        date: date || null,
      })
      setMessage(response.data.message)
      if (response.data.userwalletAddress) {
        setCompanyName("")
        setProductName("")
        setProductUrl("")
        setFile(null)
        setPreviewUrl("")
        setUserReward(0)
        setWebsiteCommission(0)
        setDate("")
      }
    } catch (error) {
      setError(error.response?.data?.error || "An error occurred while adding the product.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageUpload = async () => {
    if (!file) return null

    const uploadPreset = "hackathonform"
    const cloudName = "dgjqg72wo"
    const formData = new FormData()
    formData.append("file", file)
    formData.append("upload_preset", uploadPreset)

    try {
      const response = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: false,
      })
      return response.data.secure_url
    } catch (error) {
      console.error("Error uploading file:", error.response ? error.response.data : error.message)
      setError("Failed to upload image. Please try again.")
      return null
    }
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-gray-50 min-h-screen">
      <div className="container max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="w-full shadow-md border border-gray-200">
          <CardHeader className="space-y-1 pb-6 border-b">
            <CardTitle className="text-3xl font-bold tracking-tight text-center">Add Campaign</CardTitle>
            <CardDescription className="text-center text-gray-500">
              Fill in the details below to add your campaign to our marketplace.
            </CardDescription>
            <CardDescription className="text-center text-gray-500 italic mt-1">
              (Users will be able to get incentives only once in 24 hours for every unique campaign they click.)
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-base font-medium flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-building"
                    >
                      <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
                      <path d="M9 22v-4h6v4" />
                      <path d="M8 6h.01" />
                      <path d="M16 6h.01" />
                      <path d="M12 6h.01" />
                      <path d="M12 10h.01" />
                      <path d="M12 14h.01" />
                      <path d="M16 10h.01" />
                      <path d="M16 14h.01" />
                      <path d="M8 10h.01" />
                      <path d="M8 14h.01" />
                    </svg>
                    Company Name
                  </Label>
                  <Input
                    type="text"
                    id="companyName"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    required
                    placeholder="Enter your company name"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productName" className="text-base font-medium flex items-center gap-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="lucide lucide-megaphone"
                    >
                      <path d="m3 11 18-5v12L3 13v-2z" />
                      <path d="M11.6 16.8a3 3 0 1 1-5.8-1.6" />
                    </svg>
                    Campaign Name
                  </Label>
                  <Input
                    type="text"
                    id="productName"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    required
                    placeholder="Enter your campaign name"
                    className="w-full"
                  />
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="userReward" className="text-base font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Rewards per click
                  </Label>
                  <Input
                    type="number"
                    id="userReward"
                    value={userReward}
                    onChange={(e) => setUserReward(e.target.value)}
                    required
                    step="0.0001"
                    min="0"
                    placeholder="Enter Maximum User Reward"
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="websiteCommission" className="text-base font-medium flex items-center gap-2">
                    <Percent className="h-4 w-4" />
                    Website commission (%)
                  </Label>
                  <Input
                    type="number"
                    id="websiteCommission"
                    value={websiteCommission}
                    onChange={(e) => setWebsiteCommission(e.target.value)}
                    required
                    min="0"
                    max="100"
                    step="0.01"
                    placeholder="Enter website commission"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="date" className="text-base font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Campaign End Date (optional)
                  </Label>
                  <Input
                    type="date"
                    id="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="productUrl" className="text-base font-medium flex items-center gap-2">
                    <LinkIcon className="h-4 w-4" />
                    Campaign URL
                  </Label>
                  <Input
                    type="url"
                    id="productUrl"
                    value={productUrl}
                    onChange={(e) => setProductUrl(e.target.value)}
                    required
                    placeholder="https://example.com"
                    className="w-full"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUpload" className="text-base font-medium flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  Campaign Image
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                  <div>
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        id="imageUpload"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                        className="w-full"
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Recommended size: 400x350px. Max file size: 5MB.</p>
                  </div>

                  {previewUrl && (
                    <div className="border border-gray-200 rounded-md overflow-hidden bg-gray-50 flex items-center justify-center p-2">
                      <img
                        src={previewUrl || "/placeholder.svg"}
                        alt="Preview"
                        className="max-h-[150px] object-contain"
                      />
                    </div>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-md transition-all duration-200 ease-in-out transform hover:translate-y-[-2px] focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50"
                disabled={isLoading}
                variant="default"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Adding campaign...
                  </>
                ) : (
                  "Add Campaign"
                )}
              </Button>
            </form>

            {message && (
              <Alert className="mt-6 bg-green-50 border-green-200 text-green-800">
                <AlertTitle className="font-bold">Success</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive" className="mt-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="bg-gray-50 border-t border-gray-100 flex justify-center py-4">
            <p className="text-sm text-gray-500">All campaigns are subject to review before going live.</p>
          </CardFooter>
        </Card>
      </div>
    </section>
  )
}
