import { Link } from "react-router-dom"
import { Button } from "../ui/button"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-black bg-[#98FB98] backdrop-blur supports-[backdrop-filter]:bg-[#98FB98]/60 flex flex-col items-center">
      <div className="container flex h-14 items-center">
        <a href="/" className="flex items-center space-x-1">
        <img src="https://res.cloudinary.com/dgjqg72wo/image/upload/v1739045259/ijxpyczxa0qmyog9gego.png" alt="logo" className="h-12 w-12"/>
          <span className="text-2xl font-bold" style={{ fontFamily: "Courier, monospace" }}>
            publi-cité
          </span>
        </a>
        <nav className="ml-auto flex gap-4 sm:gap-6">
          <a className="text-sm font-medium hover:underline underline-offset-4" href="/register-company">
          Register Company
          </a>
          <a className="text-sm font-medium hover:underline underline-offset-4" href="/add-product">
          Add Campaign
          </a>
          <a className="text-sm font-medium hover:underline underline-offset-4" href="/product-display">
          Campaign Display
          </a>
          <a className="text-sm font-medium hover:underline underline-offset-4" href="/campaigns">
          Search Campaigns
          </a>
        </nav>
        <div className="ml-4">
          <Button asChild variant="outline" className="border-2 border-black">
            {/* <a href="#cta">Get Started</a> */}
            <Link to="/register-company">Get Started</Link>
          </Button>
        </div>
      </div>
    </header>
  )
}

