"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "next-themes"

type AuroraVariant = "aurora" | "waves" | "particles"

interface AuroraBackgroundProps {
  variant?: AuroraVariant
}

export default function AuroraBackground({ variant = "aurora" }: AuroraBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const animationRef = useRef<number>(0)

  useEffect(() => {
    setMounted(true)
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  useEffect(() => {
    if (!mounted) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      const { width, height } = canvas.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = width * dpr
      canvas.height = height * dpr
      ctx.scale(dpr, dpr)
    }

    window.addEventListener("resize", resizeCanvas)
    resizeCanvas()

    // Clear any existing animation
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    // Choose the right animation based on variant
    if (variant === "aurora") {
      initAuroraAnimation(canvas, ctx, theme === "dark")
    } else if (variant === "waves") {
      initWavesAnimation(canvas, ctx, theme === "dark")
    } else if (variant === "particles") {
      initParticlesAnimation(canvas, ctx, theme === "dark")
    }

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [variant, theme, mounted])

  // Aurora animation
  const initAuroraAnimation = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, isDark: boolean) => {
    const width = canvas.width
    const height = canvas.height

    // Aurora parameters
    const auroraLayers = 5
    const auroraPoints = 7
    const auroraColors = isDark
      ? [
          "rgba(76, 29, 149, 0.3)", // purple
          "rgba(16, 185, 129, 0.3)", // emerald
          "rgba(59, 130, 246, 0.3)", // blue
          "rgba(236, 72, 153, 0.3)", // pink
          "rgba(139, 92, 246, 0.3)", // violet
        ]
      : [
          "rgba(76, 29, 149, 0.1)", // purple
          "rgba(16, 185, 129, 0.1)", // emerald
          "rgba(59, 130, 246, 0.1)", // blue
          "rgba(236, 72, 153, 0.1)", // pink
          "rgba(139, 92, 246, 0.1)", // violet
        ]

    // Create aurora layers
    const layers = Array.from({ length: auroraLayers }, (_, i) => {
      const points = Array.from({ length: auroraPoints }, (_, j) => ({
        x: (width / (auroraPoints - 1)) * j,
        y: height / 2,
        originalY: height / 2,
        speed: 0.2 + Math.random() * 0.3,
        offset: Math.random() * 100,
      }))

      return {
        points,
        color: auroraColors[i % auroraColors.length],
      }
    })

    const animate = () => {
      // Clear canvas with a semi-transparent background to create trail effect
      ctx.fillStyle = isDark ? "rgba(17, 24, 39, 0.05)" : "rgba(255, 255, 255, 0.05)"
      ctx.fillRect(0, 0, width, height)

      const time = Date.now() * 0.001

      // Draw each aurora layer
      layers.forEach((layer, layerIndex) => {
        ctx.beginPath()
        ctx.moveTo(0, height)

        // Update and draw points
        layer.points.forEach((point, index) => {
          // Calculate y position with sine wave
          point.y =
            point.originalY +
            Math.sin(time * point.speed + point.offset + index * 0.5) * (height * 0.15) +
            Math.sin(time * 0.2 + layerIndex) * (height * 0.05)

          // Draw curve through points
          if (index === 0) {
            ctx.lineTo(point.x, point.y)
          } else {
            const prevPoint = layer.points[index - 1]
            const cpX = (prevPoint.x + point.x) / 2
            ctx.quadraticCurveTo(cpX, prevPoint.y, point.x, point.y)
          }
        })

        // Complete the shape
        ctx.lineTo(width, height)
        ctx.lineTo(0, height)
        ctx.closePath()

        // Fill with gradient
        const gradient = ctx.createLinearGradient(0, 0, width, height)
        gradient.addColorStop(0, layer.color)
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)")
        ctx.fillStyle = gradient
        ctx.fill()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()
  }

  // Waves animation
  const initWavesAnimation = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, isDark: boolean) => {
    const width = canvas.width
    const height = canvas.height

    // Wave parameters
    const waveCount = 3
    const waveColors = isDark
      ? [
          "rgba(139, 92, 246, 0.3)", // violet
          "rgba(59, 130, 246, 0.2)", // blue
          "rgba(16, 185, 129, 0.1)", // emerald
        ]
      : [
          "rgba(139, 92, 246, 0.1)", // violet
          "rgba(59, 130, 246, 0.08)", // blue
          "rgba(16, 185, 129, 0.05)", // emerald
        ]

    const waves = Array.from({ length: waveCount }, (_, i) => ({
      amplitude: height * (0.05 + i * 0.02),
      frequency: 0.005 - i * 0.001,
      speed: 0.001 + i * 0.0005,
      phase: 0,
      color: waveColors[i],
    }))

    const animate = () => {
      // Clear canvas
      ctx.fillStyle = isDark ? "rgba(17, 24, 39, 0.05)" : "rgba(255, 255, 255, 0.05)"
      ctx.fillRect(0, 0, width, height)

      // Update and draw each wave
      waves.forEach((wave, index) => {
        wave.phase += wave.speed

        ctx.beginPath()
        ctx.moveTo(0, height)

        // Draw wave
        for (let x = 0; x <= width; x += 5) {
          const y =
            height / 2 +
            Math.sin(x * wave.frequency + wave.phase) * wave.amplitude +
            Math.sin(x * wave.frequency * 2 + wave.phase * 1.5) * (wave.amplitude * 0.5)
          ctx.lineTo(x, y)
        }

        // Complete the shape
        ctx.lineTo(width, height)
        ctx.lineTo(0, height)
        ctx.closePath()

        // Fill with gradient
        const gradient = ctx.createLinearGradient(0, 0, 0, height)
        gradient.addColorStop(0, wave.color)
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)")
        ctx.fillStyle = gradient
        ctx.fill()
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()
  }

  // Particles animation
  const initParticlesAnimation = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, isDark: boolean) => {
    const width = canvas.width
    const height = canvas.height
    const particleCount = Math.min(width, height) * 0.05
    const baseColor = isDark ? 255 : 0
    const colorVariation = isDark ? -1 : 1

    // Create particles
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: 1 + Math.random() * 3,
      speedX: (Math.random() - 0.5) * 0.5,
      speedY: (Math.random() - 0.5) * 0.5,
      opacity: 0.1 + Math.random() * 0.4,
      color: `rgba(${baseColor + colorVariation * Math.floor(Math.random() * 50)}, 
                 ${baseColor + colorVariation * Math.floor(Math.random() * 100)}, 
                 ${baseColor + colorVariation * Math.floor(Math.random() * 150)}, 
                 0.${Math.floor(Math.random() * 9) + 1})`,
    }))

    const animate = () => {
      // Clear canvas with a semi-transparent background
      ctx.fillStyle = isDark ? "rgba(17, 24, 39, 0.05)" : "rgba(255, 255, 255, 0.05)"
      ctx.fillRect(0, 0, width, height)

      // Update and draw particles
      particles.forEach((particle) => {
        // Update position
        particle.x += particle.speedX
        particle.y += particle.speedY

        // Wrap around edges
        if (particle.x < 0) particle.x = width
        if (particle.x > width) particle.x = 0
        if (particle.y < 0) particle.y = height
        if (particle.y > height) particle.y = 0

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particle.color
        ctx.fill()

        // Draw connections between nearby particles
        particles.forEach((otherParticle) => {
          const dx = particle.x - otherParticle.x
          const dy = particle.y - otherParticle.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.beginPath()
            ctx.moveTo(particle.x, particle.y)
            ctx.lineTo(otherParticle.x, otherParticle.y)
            ctx.strokeStyle = `rgba(${baseColor + colorVariation * 100}, ${baseColor + colorVariation * 150}, ${
              baseColor + colorVariation * 200
            }, ${0.1 * (1 - distance / 100)})`
            ctx.stroke()
          }
        })
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()
  }

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full z-0"
      style={{ background: theme === "dark" ? "#111827" : "#ffffff" }}
    />
  )
}
