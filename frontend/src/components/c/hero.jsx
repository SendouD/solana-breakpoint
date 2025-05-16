import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { ArrowRight, MousePointerClick, Wallet, Globe } from "lucide-react"

export function Hero() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-gradient-to-b from-green-50 to-white">
        <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="hero-pattern"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <circle cx="20" cy="20" r="1" fill="#22c55e" fillOpacity="0.1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-pattern)" />
        </svg>
      </div>

      <div className="container relative z-10 mx-auto px-4 md:px-6 flex flex-col items-center text-center">
        <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 text-sm font-medium rounded-full bg-green-100 text-green-800 border border-green-200">
          <span className="relative flex h-2 w-2 mr-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </span>
          Web3 Advertising Platform
        </div>

        <h1
          className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl max-w-4xl bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-green-800"
          style={{ fontFamily: "Courier, monospace" }}
        >
          Revolutionize Digital Advertising with Web3
        </h1>

        <p className="max-w-[800px] mt-6 text-gray-700 md:text-xl leading-relaxed">
          A Web3-powered ad platform where users earn per click, third-party websites get a commission, and advertisers
          gain engagement seamlessly.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-10">
          <Button
            asChild
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white px-8 py-6 rounded-md shadow-lg hover:shadow-xl transition-all duration-200 transform hover:translate-y-[-2px]"
          >
            <Link to="/register-company" className="flex items-center gap-2">
              Get Started
              <ArrowRight className="h-5 w-5" />
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="border-green-200 bg-white hover:bg-green-50 text-green-700 px-8 py-6 rounded-md shadow-md hover:shadow-lg transition-all duration-200"
          >
            <Link to="/campaigns" className="flex items-center gap-2">
              View Campaigns
              <MousePointerClick className="h-5 w-5" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 max-w-3xl">
          <div className="flex flex-col items-center p-4">
            <div className="rounded-full bg-green-100 p-3 mb-3">
              <MousePointerClick className="h-6 w-6 text-green-700" />
            </div>
            <h3 className="text-lg font-semibold mb-1">Users Earn</h3>
            <p className="text-gray-600 text-sm text-center">Get rewarded for every ad interaction</p>
          </div>

          <div className="flex flex-col items-center p-4">
            <div className="rounded-full bg-green-100 p-3 mb-3">
              <Globe className="h-6 w-6 text-green-700" />
            </div>
            <h3 className="text-lg font-semibold mb-1">Websites Profit</h3>
            <p className="text-gray-600 text-sm text-center">Earn commissions from embedded ads</p>
          </div>

          <div className="flex flex-col items-center p-4">
            <div className="rounded-full bg-green-100 p-3 mb-3">
              <Wallet className="h-6 w-6 text-green-700" />
            </div>
            <h3 className="text-lg font-semibold mb-1">Instant Payments</h3>
            <p className="text-gray-600 text-sm text-center">Blockchain-powered instant transactions</p>
          </div>
        </div>
      </div>
    </section>
  )
}
