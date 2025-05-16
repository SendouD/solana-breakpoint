"use client"

import React from "react"
import { usePrivy } from "@privy-io/react-auth"
import { Link } from "react-router-dom"
import { Menu, X } from "lucide-react"

export default function Header() {
  const { login, logout, authenticated } = usePrivy()
  const [isMenuOpen, setIsMenuOpen] = React.useState(false)

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-green-500 to-green-700">
              Publi-cité
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
              Home
            </Link>
            <Link to="/campaigns" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
              Campaigns
            </Link>
            <Link to="/register-company" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
              Register
            </Link>
            <Link to="/add-product" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
              Add Campaign
            </Link>
            <Link to="/product-display" className="text-gray-700 hover:text-green-600 font-medium transition-colors">
              Manage
            </Link>
          </nav>

          {/* Auth Button */}
          <div className="flex items-center space-x-4">
            {!authenticated ? (
              <button
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-5 py-2 rounded-md font-medium shadow-sm transition-all duration-200 transform hover:translate-y-[-2px]"
                onClick={() => login({ loginMethods: ["email", "sms", "google"] })}
              >
                Login
              </button>
            ) : (
              <button
                className="bg-gray-100 hover:bg-gray-200 text-gray-800 px-5 py-2 rounded-md font-medium transition-colors"
                onClick={() => logout()}
              >
                Logout
              </button>
            )}

            {/* Mobile menu button */}
            <button className="md:hidden flex items-center" onClick={toggleMenu} aria-label="Toggle menu">
              {isMenuOpen ? <X className="h-6 w-6 text-gray-700" /> : <Menu className="h-6 w-6 text-gray-700" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 py-2">
          <div className="container mx-auto px-4 space-y-1">
            <Link
              to="/"
              className="block py-2 px-4 text-gray-700 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/campaigns"
              className="block py-2 px-4 text-gray-700 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Campaigns
            </Link>
            <Link
              to="/register-company"
              className="block py-2 px-4 text-gray-700 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Register
            </Link>
            <Link
              to="/add-product"
              className="block py-2 px-4 text-gray-700 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Add Campaign
            </Link>
            <Link
              to="/product-display"
              className="block py-2 px-4 text-gray-700 hover:bg-gray-50 rounded-md"
              onClick={() => setIsMenuOpen(false)}
            >
              Manage
            </Link>
          </div>
        </div>
      )}
    </header>
  )
}
