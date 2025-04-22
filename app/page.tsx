"use client"

import { useEffect, useState, useRef } from "react"
import Hero from "@/components/hero"
import Navbar from "@/components/navbar"
import InteractiveCards from "@/components/interactive-cards"
import ThreeDSection from "@/components/three-d-section"
import Footer from "@/components/footer"

export default function Home() {
  const [mounted, setMounted] = useState(false)
  const mainRef = useRef(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <main ref={mainRef} className="min-h-screen overflow-x-hidden">
      <Navbar />
      <Hero />
      <InteractiveCards />
      <ThreeDSection />
      <Footer />
    </main>
  )
}
