"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { ModernButton } from "@/components/ui/modern-button"
import Link from "next/link"
import { signOut } from "@/lib/supabase/actions"

export function AuthButton() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    async function getUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user || null)
      setLoading(false)

      // Listen for auth changes
      const {
        data: { subscription },
      } = await supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user || null)
      })

      return () => {
        subscription.unsubscribe()
      }
    }

    getUser()
  }, [supabase])

  async function handleSignOut() {
    setLoading(true)
    try {
      const result = await signOut()
      if (result?.redirect) {
        router.push(result.redirect)
      }
    } catch (error) {
      console.error("Sign out error:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <ModernButton variant="ghost" size="sm" disabled>
        LOADING...
      </ModernButton>
    )
  }

  if (user) {
    return (
      <ModernButton type="button" variant="outline" size="sm" onClick={handleSignOut}>
        SIGN OUT
      </ModernButton>
    )
  }

  return (
    <ModernButton asChild variant="default" size="sm">
      <Link href="/login">LOG IN</Link>
    </ModernButton>
  )
}
