import { Server,Key,ShieldCheck,Link2, KeyRoundIcon } from "lucide-react"

export function Features() {
  const features = [
    {
      icon: <Server className="h-10 w-10" />,
      title: "Privy Server Wallets",
      description: "Secure and seamless ad payments with server-side wallets.",
    },
    {
      icon: <KeyRoundIcon className="h-10 w-10" />,
      title: "Idempotency Keys",
      description: "Ensure safe and reliable transactions without duplicates.",
    },
    {
      icon: <ShieldCheck className="h-10 w-10" />,
      title: "Privy Policy Engine",
      description: "Define and enforce policies to regulate ad interactions and security.",
    },
    {
      icon: <Link2 className="h-10 w-10" />,
      title: "Embedded Links",
      description: "Easily integrate ad campaigns across third-party websites.",
    },
  ]

  return (
    <section id="features" className="w-full py-12 md:py-24 lg:py-32 bg-[#F0FFF4] flex flex-col items-center ">
      <div className="container px-4 md:px-6">
        <h2
          className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-center mb-12"
          style={{ fontFamily: "Courier, monospace" }}
        >
          Tech Stack
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex flex-col items-center text-center p-4 border-2 border-black rounded-lg bg-white"
            >
              <div className="rounded-full bg-[#98FB98] p-3 mb-4 border-2 border-black">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-700">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

