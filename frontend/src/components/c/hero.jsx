import { Button } from "../ui/button"
import { Link } from "react-router-dom"
export function Hero() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 relative overflow-hidden flex flex-col items-center" >
      <div className="container relative z-10 flex flex-col items-center text-center">
        <h1
          className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl"
          style={{ fontFamily: "Courier, monospace" }}
        >
Revolutionize Digital Advertising with Web3        </h1>
        <p className="max-w-[600px] mt-4 text-gray-700 md:text-xl">
        A Web3-powered ad platform where users earn per click, third-party websites get a commission, and advertisers gain engagement seamlessly.     </p>
        <Button asChild className="mt-8" size="lg">
          <Link to="/register-company">Get Started</Link>
        </Button>
      </div>
      <div className="absolute inset-0 z-0">
        <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern
              id="hero-pattern"
              width="40"
              height="40"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(45)"
            >
              <circle cx="20" cy="20" r="1" fill="#000" fillOpacity="0.1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hero-pattern)" />
        </svg>
      </div>
    </section>
  )
}

