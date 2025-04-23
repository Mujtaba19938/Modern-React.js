"use client"
import { ArrowRight } from "lucide-react"
import { ModernButton } from "@/components/ui/modern-button"
import { useState } from "react"

export default function Hero() {
  const [isLoading, setIsLoading] = useState(false)

  const handleExplore = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1500)
  }

  return (
    <section
      className="min-h-screen flex flex-col justify-center items-center text-center px-4 pt-20"
      style={{
        background: "radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.1) 0%, rgba(0, 0, 0, 0) 70%)",
      }}
    >
      <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-10 bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-500 animate-fade-in-up">
        Crafting Digital Experiences
      </h1>
      <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 max-w-3xl mb-12 animate-fade-in-up animation-delay-200">
        A modern, visually stunning website with smooth animations, interactive elements, and immersive 3D experiences.
      </p>

      <div className="flex flex-wrap gap-4 justify-center animate-fade-in-up animation-delay-400">
        <ModernButton size="lg" isLoading={isLoading} onClick={handleExplore} className="group">
          EXPLORE PROJECTS
          <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
        </ModernButton>

        <ModernButton variant="outline" size="lg" className="group">
          LEARN MORE
        </ModernButton>
      </div>

      <div className="absolute bottom-10 flex flex-col items-center animate-bounce">
        <span className="text-sm text-gray-500 dark:text-gray-400 mb-2">Scroll to explore</span>
        <div className="w-1 h-10 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full" />
      </div>
    </section>
  )
}
