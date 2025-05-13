import { Header } from "./c/header"
import { Hero } from "./c/hero"
import { HowItWorks } from "./c/how-it-works"
import { Features } from "./c/features"
import { Testimonials } from "./c/testimonials"
import { Security } from "./c/security"
import { Pricing } from "./c/pricing"
import { CTA } from "./c/cta"
import { Footer } from "./c/footer"

function LandingPage() {
  return (
    <div className="flex-1 flex-col bg-[#f0fff4] text-black">
        <Hero />
        <HowItWorks />
        <Features />
        {/* <Testimonials /> */}
        {/* <Security />
        <Pricing /> */}
        {/* <CTA /> */}
    </div>
  )
}

export default LandingPage

