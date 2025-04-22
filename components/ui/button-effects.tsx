"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface RippleProps {
  x: number
  y: number
  size: number
}

interface ButtonEffectsProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: "default" | "primary" | "secondary" | "outline" | "ghost" | "link" | "gradient"
  size?: "default" | "sm" | "lg" | "icon"
  withRipple?: boolean
  withHoverScale?: boolean
  withSound?: boolean
  withGlow?: boolean
  isLoading?: boolean
  loadingText?: string
  className?: string
}

export function ButtonEffects({
  children,
  variant = "default",
  size = "default",
  withRipple = true,
  withHoverScale = true,
  withSound = false,
  withGlow = false,
  isLoading = false,
  loadingText,
  className,
  ...props
}: ButtonEffectsProps) {
  const [ripples, setRipples] = useState<RippleProps[]>([])
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const soundRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    if (withSound) {
      soundRef.current = new Audio("/sounds/click.mp3")
    }
  }, [withSound])

  const handleMouseDown = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (withRipple && buttonRef.current) {
      const button = buttonRef.current
      const rect = button.getBoundingClientRect()
      const size = Math.max(button.offsetWidth, button.offsetHeight)
      const x = e.clientX - rect.left - size / 2
      const y = e.clientY - rect.top - size / 2

      const newRipple = { x, y, size }
      setRipples([...ripples, newRipple])

      setTimeout(() => {
        setRipples((prevRipples) => prevRipples.filter((ripple) => ripple !== newRipple))
      }, 600)
    }

    setIsPressed(true)

    if (withSound && soundRef.current) {
      soundRef.current.currentTime = 0
      soundRef.current.play().catch(() => {
        // Handle autoplay restrictions
      })
    }
  }

  const handleMouseUp = () => {
    setIsPressed(false)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setIsPressed(false)
  }

  // Determine base classes based on variant and size
  const baseClasses = cn(
    "relative inline-flex items-center justify-center rounded-md text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
      "bg-primary text-primary-foreground hover:bg-primary/90": variant === "default",
      "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700":
        variant === "gradient",
      "bg-secondary text-secondary-foreground hover:bg-secondary/80": variant === "secondary",
      "border border-input bg-background hover:bg-accent hover:text-accent-foreground": variant === "outline",
      "hover:bg-accent hover:text-accent-foreground": variant === "ghost",
      "text-primary underline-offset-4 hover:underline": variant === "link",
      "h-10 px-4 py-2": size === "default",
      "h-9 rounded-md px-3": size === "sm",
      "h-11 rounded-md px-8": size === "lg",
      "h-10 w-10": size === "icon",
      "transform active:scale-95": withHoverScale,
      "overflow-hidden": withRipple,
    },
    className,
  )

  // Add glow effect if enabled
  const glowClasses =
    withGlow && isHovered
      ? "before:absolute before:inset-0 before:rounded-md before:bg-white before:opacity-0 before:transition before:duration-300 hover:before:opacity-20"
      : ""

  // Add scale effect if enabled
  const scaleClasses = withHoverScale
    ? `transform transition-transform duration-200 ${isPressed ? "scale-95" : isHovered ? "scale-[1.02]" : "scale-100"}`
    : ""

  // Add shadow effect
  const shadowClasses =
    variant !== "ghost" && variant !== "link" ? "shadow-sm hover:shadow-md transition-shadow duration-200" : ""

  return (
    <button
      ref={buttonRef}
      className={cn(baseClasses, glowClasses, scaleClasses, shadowClasses)}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {/* Ripple effect */}
      {withRipple &&
        ripples.map((ripple, i) => (
          <span
            key={i}
            className="absolute rounded-full bg-white/30 animate-ripple pointer-events-none"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: ripple.size,
              height: ripple.size,
            }}
          />
        ))}

      {/* Loading spinner */}
      {isLoading ? (
        <div className="flex items-center justify-center">
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-current"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          <span>{loadingText || "Loading..."}</span>
        </div>
      ) : (
        children
      )}
    </button>
  )
}
