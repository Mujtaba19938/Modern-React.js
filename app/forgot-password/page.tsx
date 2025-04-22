"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Mail, CheckCircle } from "lucide-react"
import { ModernButton } from "@/components/ui/modern-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { resetPassword } from "@/lib/supabase/actions"

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [email, setEmail] = useState("")

  // Handle form submission with server action
  async function handleResetPassword(formData: FormData) {
    setIsLoading(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      const result = await resetPassword(formData)
      if (result?.error) {
        setErrorMessage(result.error)
      } else if (result?.success) {
        setEmail(formData.get("email") as string)
        setSuccessMessage(result.success)
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
            href="/login"
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to login
          </Link>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          {!successMessage ? (
            <>
              <div className="text-center mb-8">
                <div className="flex justify-center mb-4">
                  <div className="relative w-12 h-12 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center overflow-hidden">
                    <div className="absolute inset-0 bg-white dark:bg-gray-800 rounded-lg m-0.5"></div>
                    <span className="relative text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-emerald-500 to-teal-500">
                      M
                    </span>
                  </div>
                </div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Forgot password?</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">No worries, we'll send you reset instructions</p>
              </div>

              {errorMessage && (
                <div className="mb-6 p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg text-sm">
                  {errorMessage}
                </div>
              )}

              <form action={handleResetPassword} className="space-y-6">
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

                <ModernButton type="submit" className="w-full" isLoading={isLoading}>
                  RESET PASSWORD
                </ModernButton>
              </form>
            </>
          ) : (
            <div className="text-center py-8">
              <div className="flex justify-center mb-6">
                <div className="rounded-full bg-emerald-100 dark:bg-emerald-900/30 p-3">
                  <CheckCircle className="h-10 w-10 text-emerald-500" />
                </div>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Check your email</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                We've sent a password reset link to
                <br />
                <span className="font-medium text-gray-900 dark:text-white">{email}</span>
              </p>
              <ModernButton asChild className="w-full">
                <Link href="/login">BACK TO LOGIN</Link>
              </ModernButton>
              <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                Didn't receive the email?{" "}
                <button
                  onClick={() => setSuccessMessage(null)}
                  className="text-emerald-500 hover:text-emerald-600 dark:text-emerald-400 dark:hover:text-emerald-300"
                >
                  Click to resend
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
