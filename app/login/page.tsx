"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Mail, Lock, Github, Twitter, Linkedin } from "lucide-react"
import { ModernButton } from "@/components/ui/modern-button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { login } from "@/lib/supabase/actions"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  // Handle form submission with server action
  async function handleLogin(formData: FormData) {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const result = await login(formData)
      if (result?.error) {
        setErrorMessage(result.error)
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again.")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle social login
  async function handleSocialLogin(provider: "github" | "twitter" | "linkedin") {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          // Supabase will use the current origin by default
          redirectTo: `/auth/callback`,
        },
      })

      if (error) {
        setErrorMessage(error.message)
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again.")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-md">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="relative w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-lg m-0.5"></div>
                <span className="relative text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-emerald-500 to-teal-500">
                  M
                </span>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Sign in to your account</p>
          </div>

          {errorMessage && (
            <div className="mb-6 p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm">
              {errorMessage}
            </div>
          )}

          <form action={handleLogin} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="name@example.com"
                    className="pl-10 h-12 rounded-full"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    href="/forgot-password"
                    className="text-sm text-emerald-500 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300"
                  >
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10 h-12 rounded-full"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox id="remember" name="remember" />
                <Label htmlFor="remember" className="text-sm font-normal">
                  Remember me for 30 days
                </Label>
              </div>
            </div>

            <ModernButton type="submit" className="w-full" isLoading={isLoading}>
              SIGN IN
            </ModernButton>

            <div className="flex items-center justify-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Don't have an account?{" "}
                <Link
                  href="/register"
                  className="text-emerald-500 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300"
                >
                  Sign up
                </Link>
              </span>
            </div>
          </form>

          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white dark:bg-gray-800 px-2 text-gray-500 dark:text-gray-400">
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3">
              <ModernButton
                variant="outline"
                className="h-12"
                onClick={() => handleSocialLogin("github")}
                disabled={isLoading}
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </ModernButton>
              <ModernButton
                variant="outline"
                className="h-12"
                onClick={() => handleSocialLogin("twitter")}
                disabled={isLoading}
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </ModernButton>
              <ModernButton
                variant="outline"
                className="h-12"
                onClick={() => handleSocialLogin("linkedin")}
                disabled={isLoading}
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </ModernButton>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500 dark:text-gray-400">
          By signing in, you agree to our{" "}
          <Link
            href="/terms"
            className="text-emerald-500 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link
            href="/privacy"
            className="text-emerald-500 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300"
          >
            Privacy Policy
          </Link>
        </div>
      </div>
    </div>
  )
}
