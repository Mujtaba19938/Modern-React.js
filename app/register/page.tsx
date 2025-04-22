"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Mail, Lock, User, Github, Twitter, Linkedin } from "lucide-react"
import { ModernButton } from "@/components/ui/modern-button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { signUp } from "@/lib/supabase/actions"
import { createClient } from "@/lib/supabase/client"

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const supabase = createClient()

  // Handle form submission with server action
  async function handleRegister(formData: FormData) {
    setIsLoading(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const result = await signUp(formData)
      if (result?.error) {
        setErrorMessage(result.error)
      } else if (result?.success) {
        setSuccessMessage(result.success)
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred. Please try again.")
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  // Handle social login
  async function handleSocialSignUp(provider: "github" | "twitter" | "linkedin") {
    setIsLoading(true)
    setErrorMessage(null)

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
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
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Create an account</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Sign up to get started</p>
          </div>

          {errorMessage && (
            <div className="mb-6 p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm">
              {errorMessage}
            </div>
          )}

          {successMessage && (
            <div className="mb-6 p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg text-sm">
              {successMessage}
            </div>
          )}

          <form action={handleRegister} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    placeholder="John Doe"
                    className="pl-10 h-12 rounded-full"
                    required
                  />
                </div>
              </div>

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
                <Label htmlFor="password">Password</Label>
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
                <Checkbox id="terms" name="terms" required />
                <Label htmlFor="terms" className="text-sm font-normal">
                  I agree to the{" "}
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
                </Label>
              </div>
            </div>

            <ModernButton type="submit" className="w-full" isLoading={isLoading}>
              SIGN UP
            </ModernButton>

            <div className="flex items-center justify-center">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-emerald-500 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300"
                >
                  Sign in
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
                onClick={() => handleSocialSignUp("github")}
                disabled={isLoading}
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </ModernButton>
              <ModernButton
                variant="outline"
                className="h-12"
                onClick={() => handleSocialSignUp("twitter")}
                disabled={isLoading}
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </ModernButton>
              <ModernButton
                variant="outline"
                className="h-12"
                onClick={() => handleSocialSignUp("linkedin")}
                disabled={isLoading}
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </ModernButton>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
