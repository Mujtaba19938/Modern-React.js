"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Code, Layers, Zap, Palette } from "lucide-react"
import { ModernButton } from "@/components/ui/modern-button"

const features = [
  {
    title: "Next.js Framework",
    description: "Built with the latest Next.js for optimal performance and SEO.",
    icon: <Code className="h-10 w-10" />,
  },
  {
    title: "Tailwind CSS",
    description: "Utility-first CSS framework for rapid UI development.",
    icon: <Palette className="h-10 w-10" />,
  },
  {
    title: "CSS Animations",
    description: "Smooth, high-performance animations for an engaging experience.",
    icon: <Zap className="h-10 w-10" />,
  },
  {
    title: "Three.js Integration",
    description: "Immersive 3D elements that enhance visual appeal.",
    icon: <Layers className="h-10 w-10" />,
  },
]

export default function InteractiveCards() {
  return (
    <section className="py-20 px-4 bg-gray-50 dark:bg-gray-900/50" id="about">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-500">
          Modern Technologies
        </h2>
        <p className="text-center text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12">
          Leveraging cutting-edge web technologies to create immersive digital experiences.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card
              key={index}
              className="border border-gray-200 dark:border-gray-800 hover:border-emerald-300 dark:hover:border-emerald-800 transition-all hover:-translate-y-2 duration-300"
            >
              <CardContent className="p-6 flex flex-col items-center text-center">
                <div className="mb-4 text-emerald-500 dark:text-emerald-400 p-3 bg-emerald-100 dark:bg-emerald-900/30 rounded-full hover:scale-110 transition-transform duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{feature.description}</p>

                <ModernButton>LEARN MORE</ModernButton>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
