"use server"

import { cookies } from "next/headers"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import { redirect } from "next/navigation"
import type { Database } from "@/lib/supabase/database.types"

// Login with email and password
export async function login(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const supabase = createServerActionClient<Database>({ cookies })

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  redirect("/")
}

// Sign up with email and password - simplified for testing
export async function signUp(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const fullName = formData.get("name") as string
  const supabase = createServerActionClient<Database>({ cookies })

  // For testing purposes, we'll sign up without email verification
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: fullName,
      },
      // Skip email verification for testing
      emailRedirectTo: undefined,
    },
  })

  if (error) {
    return { error: error.message }
  }

  // Create a profile for the user
  if (data.user) {
    const { error: profileError } = await supabase.from("profiles").upsert({
      id: data.user.id,
      full_name: fullName,
      username: email.split("@")[0],
      avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=10b981&color=fff`,
    })

    if (profileError) {
      console.error("Error creating profile:", profileError)
    }
  }

  // Auto sign in after registration for testing
  if (data.user) {
    await supabase.auth.signInWithPassword({
      email,
      password,
    })

    return { success: "Account created successfully! Redirecting...", redirect: true }
  }

  return { success: "Account created successfully! You can now log in." }
}

// Reset password
export async function resetPassword(formData: FormData) {
  const email = formData.get("email") as string
  const supabase = createServerActionClient<Database>({ cookies })

  // We'll use a callback URL without domain - Supabase will use the request origin
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `/auth/reset-password`,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: "Check your email for the password reset link!" }
}

// Sign out
export async function signOut() {
  const supabase = createServerActionClient<Database>({ cookies })
  await supabase.auth.signOut()
  redirect("/login")
}

// Update profile
export async function updateProfile(formData: FormData) {
  const supabase = createServerActionClient<Database>({ cookies })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session?.user) {
    return { error: "Not authenticated" }
  }

  const userId = session.user.id
  const username = formData.get("username") as string
  const fullName = formData.get("fullName") as string
  const website = formData.get("website") as string
  const bio = formData.get("bio") as string

  // Update the profile
  const { error } = await supabase
    .from("profiles")
    .update({
      username,
      full_name: fullName,
      website,
      bio,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)

  if (error) {
    return { error: error.message }
  }

  // Update user metadata
  await supabase.auth.updateUser({
    data: {
      full_name: fullName,
    },
  })

  return { success: "Profile updated successfully!" }
}
