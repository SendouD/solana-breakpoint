import { Code, FilePlus, MousePointerClick, Wallet, ArrowRight } from "lucide-react"

export function HowItWorks() {
  const steps = [
    {
      icon: <Wallet className="h-10 w-10 text-green-700" />,
      title: "Register",
      description: "Register your company on Publi-cité",
    },
    {
      icon: <FilePlus className="h-10 w-10 text-green-700" />,
      title: "Create an Ad Campaign",
      description: "Set campaign name, URL, images, user rewards & website commission.",
    },
    {
      icon: <Code className="h-10 w-10 text-green-700" />,
      title: "Get Embed Links",
      description: "Publi-cité generates embed links for third-party websites.",
    },
    {
      icon: <MousePointerClick className="h-10 w-10 text-green-700" />,
      title: "Users Interact & Earn",
      description: "Users click ads, confirm via MetaMask, and receive rewards instantly.",
    },
  ]

  return (
    <section id="how-it-works" className="w-full py-16 md:py-24 lg:py-32 bg-gradient-to-b from-white to-green-50">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-green-100 text-green-800 border border-green-200">
            Simple Process
          </div>
          <h2
            className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4"
            style={{ fontFamily: "Courier, monospace" }}
          >
            How It Works
          </h2>
          <p className="max-w-[600px] text-gray-600 md:text-lg">
            Our platform makes Web3 advertising simple and rewarding for everyone involved
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
          {steps.map((step, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 rounded-xl bg-white border border-green-100 shadow-sm hover:shadow-md transition-all duration-300 transform hover:translate-y-[-5px]"
            >
              <div className="rounded-full bg-green-50 p-4 mb-5 border border-green-100">{step.icon}</div>
              <h3 className="text-xl font-bold mb-3">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>

              {index < steps.length - 1 && (
                <div className="hidden lg:flex absolute right-0 transform translate-x-1/2 mt-10">
                  <div className="h-0.5 w-8 bg-green-200"></div>
                  <div className="h-3 w-3 rounded-full bg-green-300 -mt-1.5 -ml-1"></div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-gray-600 mb-6">Ready to transform your advertising strategy?</p>
          <a
            href="/register-company"
            className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white font-medium rounded-md shadow-md hover:bg-green-700 transition-colors"
          >
            Start Your Campaign
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
