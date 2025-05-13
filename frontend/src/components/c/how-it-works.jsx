import { Code, CreditCard, FilePlus, MousePointerClick, Sparkles, TrendingUp, Wallet } from "lucide-react"

export function HowItWorks() {
  const steps = [
    { icon: <Wallet className="h-10 w-10" />, title: "Register ", description: "Register your company on Publi-cité" },
    { icon: <FilePlus className="h-10 w-10" />, title: "Create an Ad Campaign", description: "Set campaign name, URL, images, user rewards & website commission." },
    {
      icon: <Code className="h-10 w-10" />,
      title: "Get Embed Links",
      description: "Publi-cité generates embed links for third-party websites.",
    },
    {
      icon: <MousePointerClick className="h-10 w-10" />,
      title: "Users Interact & Earn",
      description: "Users click ads, confirm via MetaMask, and receive rewards instantly.",
    },
  ]

  return (
    <section id="how-it-works" className="w-full py-12 md:py-24 lg:py-32 bg-[#E0FFF0] flex flex-col items-center">
      <div className="container px-4 md:px-6">
        <h2
          className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12"
          style={{ fontFamily: "Courier, monospace" }}
        >
          How It Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-4 border-2 border-black rounded-lg bg-white"
            >
              <div className="rounded-full bg-[#98FB98] p-3 mb-4 border-2 border-black">{step.icon}</div>
              <h3 className="text-xl font-bold mb-2">{step.title}</h3>
              <p className="text-gray-700">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

