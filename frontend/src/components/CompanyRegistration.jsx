"use client"

import { useEffect, useState } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { AlertCircle, Building, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"

const backendapi = import.meta.env.VITE_BACKEND_API

export default function CompanyRegistration() {
  const [companyName, setCompanyName] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    console.log(backendapi)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setMessage("")

    try {
      const response = await axios.post(`${backendapi}/api/create-company`, { companyName })
      setMessage(response.data.message)
      if (response.data.company) {
        setCompanyName("")
      }
    } catch (error) {
      setError(error.response?.data?.error || "An error occurred while registering the company.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gradient-to-b from-white to-green-50 min-h-screen flex items-center justify-center">
      <div className="container max-w-md mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="w-full shadow-lg border border-gray-200">
          <CardHeader className="space-y-1 pb-6 border-b">
            <div className="flex justify-center mb-2">
              <div className="rounded-full bg-green-100 p-3">
                <Building className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold tracking-tight text-center">Register Company</CardTitle>
            <CardDescription className="text-center text-gray-500">
              Enter your company name to register in our system.
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
                  placeholder="Enter your company name"
                  className="w-full"
                />
                <p className="text-xs text-gray-500">This name will be used to identify your campaigns and wallets.</p>
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
                    Registering...
                  </>
                ) : (
                  "Register Company"
                )}
              </Button>
            </form>

            {message && (
              <Alert className="mt-6 bg-green-50 border-green-200 text-green-800">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="font-bold">Success</AlertTitle>
                <AlertDescription>{message}</AlertDescription>
              </Alert>
            )}

            {error && (
              <Alert variant="destructive" className="mt-6">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Company already exists</AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter className="bg-gray-50 border-t border-gray-100 flex justify-center py-4">
            <p className="text-sm text-gray-500">
              Already registered?{" "}
              <a href="/add-product" className="text-green-600 hover:underline">
                Add a campaign
              </a>
            </p>
          </CardFooter>
        </Card>
      </div>
    </section>
  )
}
