"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { updateProfile } from "@/lib/supabase/actions"
import { ModernButton } from "@/components/ui/modern-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { User, Mail, LinkIcon, FileText, Camera, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function ProfilePage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  useEffect(() => {
    async function getProfile() {
      setLoading(true)

      // Get the current session
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (!session) {
        router.push("/login")
        return
      }

      setUser(session.user)

      // Fetch the user's profile
      const { data, error } = await supabase.from("profiles").select("*").eq("id", session.user.id).single()

      if (error) {
        console.error("Error fetching profile:", error)
      } else {
        setProfile(data)
      }

      setLoading(false)
    }

    getProfile()
  }, [router, supabase])

  async function handleUpdateProfile(formData: FormData) {
    setUpdating(true)
    setMessage(null)

    try {
      const result = await updateProfile(formData)

      if (result.error) {
        setMessage({ type: "error", text: result.error })
      } else if (result.success) {
        setMessage({ type: "success", text: result.success })

        // Refresh the profile data
        const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single()

        if (data) {
          setProfile(data)
        }
      }
    } catch (error) {
      setMessage({ type: "error", text: "An unexpected error occurred" })
      console.error(error)
    } finally {
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pt-20 pb-10 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-600 dark:text-gray-400 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to home
          </Link>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Profile sidebar */}
          <div className="w-full md:w-1/3">
            <Card>
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <Avatar className="h-24 w-24 border-4 border-white dark:border-gray-800 shadow-md">
                    <AvatarImage src={profile?.avatar_url || "/placeholder.svg?height=96&width=96"} />
                    <AvatarFallback className="text-2xl">
                      {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </div>
                <CardTitle>{profile?.full_name || "User"}</CardTitle>
                <CardDescription className="flex items-center justify-center gap-1">
                  <Mail className="h-3 w-3" />
                  {user?.email}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 text-sm">
                  {profile?.username && (
                    <div className="flex items-start gap-2">
                      <User className="h-4 w-4 text-gray-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-500 dark:text-gray-400">Username</p>
                        <p>{profile.username}</p>
                      </div>
                    </div>
                  )}

                  {profile?.website && (
                    <div className="flex items-start gap-2">
                      <LinkIcon className="h-4 w-4 text-gray-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-500 dark:text-gray-400">Website</p>
                        <a
                          href={profile.website.startsWith("http") ? profile.website : `https://${profile.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-emerald-500 hover:underline"
                        >
                          {profile.website}
                        </a>
                      </div>
                    </div>
                  )}

                  {profile?.bio && (
                    <div className="flex items-start gap-2">
                      <FileText className="h-4 w-4 text-gray-500 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-500 dark:text-gray-400">Bio</p>
                        <p>{profile.bio}</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <ModernButton asChild variant="outline" className="w-full">
                  <Link href="/profile/avatar">
                    <Camera className="mr-2 h-4 w-4" />
                    Change Avatar
                  </Link>
                </ModernButton>
              </CardFooter>
            </Card>
          </div>

          {/* Main content */}
          <div className="w-full md:w-2/3">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="profile">Profile</TabsTrigger>
                <TabsTrigger value="account">Account</TabsTrigger>
              </TabsList>

              <TabsContent value="profile" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your profile information visible to other users</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {message && (
                      <div
                        className={`mb-6 p-3 rounded-lg text-sm ${
                          message.type === "success"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                            : "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                        }`}
                      >
                        {message.text}
                      </div>
                    )}

                    <form action={handleUpdateProfile} className="space-y-6">
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor="username">Username</Label>
                            <Input
                              id="username"
                              name="username"
                              defaultValue={profile?.username || ""}
                              placeholder="username"
                            />
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input
                              id="fullName"
                              name="fullName"
                              defaultValue={profile?.full_name || ""}
                              placeholder="John Doe"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="website">Website</Label>
                          <Input
                            id="website"
                            name="website"
                            defaultValue={profile?.website || ""}
                            placeholder="https://example.com"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            id="bio"
                            name="bio"
                            defaultValue={profile?.bio || ""}
                            placeholder="Tell us about yourself"
                            rows={4}
                          />
                        </div>
                      </div>

                      <ModernButton type="submit" isLoading={updating}>
                        SAVE CHANGES
                      </ModernButton>
                    </form>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="account" className="mt-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Settings</CardTitle>
                    <CardDescription>Manage your account settings and preferences</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <div>
                          <h3 className="font-medium">Email Address</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                        </div>
                        <ModernButton variant="outline" size="sm">
                          Change Email
                        </ModernButton>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <div>
                          <h3 className="font-medium">Password</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">Last updated: Never</p>
                        </div>
                        <ModernButton variant="outline" size="sm">
                          Change Password
                        </ModernButton>
                      </div>

                      <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                        <div>
                          <h3 className="font-medium">Delete Account</h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Permanently delete your account and all data
                          </p>
                        </div>
                        <ModernButton variant="outline" size="sm" className="text-red-500 hover:text-red-600">
                          Delete Account
                        </ModernButton>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  )
}
