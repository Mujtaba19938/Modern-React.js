"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useTheme } from "next-themes"

interface PreloaderProps {
  minimumLoadTimeMs?: number
  children: React.ReactNode
}

export default function Preloader({ minimumLoadTimeMs = 1500, children }: PreloaderProps) {
  const [loading, setLoading] = useState(true)
  const { theme } = useTheme()
  const isDarkTheme = theme === "dark"

  useEffect(() => {
    // Ensure the preloader shows for at least the minimum time
    // and wait for the window load event
    const minimumLoadTimer = setTimeout(() => {
      if (document.readyState === "complete") {
        setLoading(false)
      } else {
        const handleLoad = () => {
          setLoading(false)
          window.removeEventListener("load", handleLoad)
        }
        window.addEventListener("load", handleLoad)
        return () => window.removeEventListener("load", handleLoad)
      }
    }, minimumLoadTimeMs)

    return () => clearTimeout(minimumLoadTimer)
  }, [minimumLoadTimeMs])

  return (
    <>
      <AnimatePresence mode="wait">
        {loading && (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden"
            style={{
              backgroundColor: isDarkTheme ? "#111827" : "#ffffff",
            }}
          >
            {/* Animated background */}
            <div className="absolute inset-0 overflow-hidden">
              {/* Animated gradient orbs */}
              <div className="absolute top-1/4 left-1/4 w-1/2 h-1/2 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 blur-3xl animate-float-slow"></div>
              <div className="absolute bottom-1/4 right-1/4 w-1/3 h-1/3 rounded-full bg-gradient-to-r from-purple-500/10 to-pink-500/10 blur-3xl animate-float-slow-reverse"></div>

              {/* Subtle grid pattern */}
              <div
                className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03]"
                style={{
                  backgroundImage: `radial-gradient(circle at 1px 1px, ${isDarkTheme ? "white" : "black"} 1px, transparent 0)`,
                  backgroundSize: "40px 40px",
                }}
              ></div>
            </div>

            <div className="flex flex-col items-center relative z-10">
              {/* Loading spinner */}
              <div className="relative w-12 h-12">
                <div className="absolute inset-0 rounded-full border-4 border-gray-200 dark:border-gray-800"></div>
                <div className="absolute inset-0 rounded-full border-4 border-t-emerald-500 animate-spin"></div>
              </div>

              {/* Loading text */}
              <p className="mt-6 text-gray-600 dark:text-gray-400 text-sm font-medium tracking-wider uppercase">
                Loading
                <span className="inline-flex ml-1 animate-pulse">
                  <span className="mr-0.5">.</span>
                  <span className="mr-0.5 animation-delay-200">.</span>
                  <span className="animation-delay-400">.</span>
                </span>
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content */}
      <AnimatePresence>
        {!loading && (
          <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
