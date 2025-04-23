"use server"

import { cookies } from "next/headers"
import { createServerActionClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/supabase/database.types"
import { createAdminClient } from "./server-admin"

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

  // Return success with redirect flag instead of using redirect()
  return { success: "Logged in successfully!", redirect: true }
}

// Sign up with email and password - simplified for testing
export async function signUp(formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string
  const fullName = formData.get("name") as string
  const supabase = createServerActionClient<Database>({ cookies })

  try {
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
      console.error("Auth signup error:", error)
      return { error: error.message }
    }

    // If user was created successfully
    if (data.user) {
      try {
        // Use admin client to bypass RLS for profile creation
        const adminClient = createAdminClient()

        // Create a profile for the user using the admin client
        const { error: profileError } = await adminClient.from("profiles").insert({
          id: data.user.id,
          full_name: fullName,
          username: email.split("@")[0],
          avatar_url: `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=10b981&color=fff`,
          updated_at: new Date().toISOString(),
        })

        if (profileError) {
          console.error("Error creating profile:", profileError)
          // Continue with sign-in even if profile creation fails
        }
      } catch (profileCreationError) {
        console.error("Profile creation exception:", profileCreationError)
        // Continue with sign-in even if profile creation fails
      }

      // Auto sign in after registration for testing
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInError) {
        console.error("Auto sign-in error:", signInError)
        return {
          success: "Account created successfully! You can now log in.",
          error: "Auto sign-in failed. Please log in manually.",
        }
      }

      return { success: "Account created successfully! Redirecting...", redirect: true }
    }

    return { success: "Account created successfully! You can now log in." }
  } catch (exception) {
    console.error("Signup exception:", exception)
    return { error: "An unexpected error occurred during sign up. Please try again." }
  }
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

  // Return redirect flag instead of using redirect()
  return { success: "Logged out successfully", redirect: "/login" }
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

  try {
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
      console.error("Profile update error:", error)
      return { error: error.message }
    }

    // Update user metadata
    await supabase.auth.updateUser({
      data: {
        full_name: fullName,
      },
    })

    return { success: "Profile updated successfully!" }
  } catch (error) {
    console.error("Profile update exception:", error)
    return { error: "An unexpected error occurred while updating your profile." }
  }
}
