"use client"

import { ArrowRight } from "lucide-react"
import { ModernButton } from "@/components/ui/modern-button"
import { useState, useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import AuroraBackground from "./aurora-background"

export default function Hero() {
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [bgVariant, setBgVariant] = useState<"aurora" | "waves" | "particles">("aurora")
  const { theme } = useTheme()
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleExplore = () => {
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1500)
  }

  const cycleBgVariant = () => {
    const variants: Array<"aurora" | "waves" | "particles"> = ["aurora", "waves", "particles"]
    const currentIndex = variants.indexOf(bgVariant)
    const nextIndex = (currentIndex + 1) % variants.length
    setBgVariant(variants[nextIndex])
  }

  return (
    <section
      ref={heroRef}
      className="min-h-screen flex flex-col justify-center items-center text-center px-4 pt-20 relative overflow-hidden"
    >
      {/* Background animation */}
      <AuroraBackground variant={bgVariant} />

      {/* Hero content */}
      <div className="relative z-10 animate-fade-in">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-white dark:from-pink-200 dark:to-white animate-scale-up">
          Crafting Digital Experiences
        </h1>
        <p className="text-lg md:text-xl text-gray-200 dark:text-gray-300 max-w-3xl mb-12 animate-fade-in animation-delay-200">
          A modern, visually stunning website with smooth animations, interactive elements, and immersive 3D
          experiences.
        </p>

        <div className="flex flex-wrap gap-4 justify-center animate-fade-in animation-delay-400">
          <ModernButton size="lg" isLoading={isLoading} onClick={handleExplore} className="group">
            EXPLORE PROJECTS
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </ModernButton>

          <ModernButton variant="outline" size="lg" className="group">
            LEARN MORE
          </ModernButton>
        </div>

        <button
          onClick={cycleBgVariant}
          className="mt-8 px-4 py-2 text-sm bg-black/20 dark:bg-white/10 backdrop-blur-sm rounded-full 
                  border border-white/20 hover:bg-black/30 dark:hover:bg-white/20 transition-all 
                  text-white/80 hover:text-white focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          switch bg
        </button>
      </div>

      <div className="absolute bottom-10 flex flex-col items-center animate-bounce z-10">
        <span className="text-sm text-gray-300 dark:text-gray-400 mb-2">Scroll to explore</span>
        <div className="w-1 h-10 bg-gradient-to-b from-pink-300 to-purple-500 rounded-full" />
      </div>
    </section>
  )
}
