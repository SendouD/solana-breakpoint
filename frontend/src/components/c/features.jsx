import { Server, ShieldCheck, Link2, KeyRoundIcon, ArrowRight } from "lucide-react"

export function Features() {
  const features = [
    {
      icon: <Server className="h-10 w-10 text-green-700" />,
      title: "Privy Server Wallets",
      description: "Secure and seamless ad payments with server-side wallets.",
    },
    {
      icon: <KeyRoundIcon className="h-10 w-10 text-green-700" />,
      title: "Idempotency Keys",
      description: "Ensure safe and reliable transactions without duplicates.",
    },
    {
      icon: <ShieldCheck className="h-10 w-10 text-green-700" />,
      title: "Privy Policy Engine",
      description: "Define and enforce policies to regulate ad interactions and security.",
    },
    {
      icon: <Link2 className="h-10 w-10 text-green-700" />,
      title: "Embedded Links",
      description: "Easily integrate ad campaigns across third-party websites.",
    },
  ]

  return (
    <section id="features" className="w-full py-16 md:py-24 lg:py-32 bg-white">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-4 text-sm font-medium rounded-full bg-green-100 text-green-800 border border-green-200">
            Powered By
          </div>
          <h2
            className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4"
            style={{ fontFamily: "Courier, monospace" }}
          >
            Tech Stack
          </h2>
          <p className="max-w-[600px] text-gray-600 md:text-lg">
            Built with cutting-edge Web3 technologies for security, speed, and reliability
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-6 rounded-xl bg-white border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 transform hover:translate-y-[-5px]"
            >
              <div className="rounded-full bg-green-50 p-4 mb-5 border border-green-100">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col md:flex-row items-center justify-center gap-8 p-8 bg-green-50 rounded-2xl border border-green-100">
          <div className="md:w-2/3 text-center md:text-left">
            <h3 className="text-2xl font-bold mb-3">Ready to leverage our tech stack?</h3>
            <p className="text-gray-600">
              Our platform combines the best of Web3 technologies to create a seamless advertising experience.
            </p>
          </div>
          <div className="md:w-1/3 flex justify-center md:justify-end">
            <a
              href="/register-company"
              className="inline-flex items-center justify-center px-6 py-3 bg-green-600 text-white font-medium rounded-md shadow-md hover:bg-green-700 transition-colors"
            >
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
