"use client"

import { useState, useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { Moon, Sun, X, Search, Bell, ChevronDown } from "lucide-react"
import { ModernButton } from "@/components/ui/modern-button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { AuthButton } from "@/components/auth-button"
import { createClient } from "@/lib/supabase/client"
import { signOut } from "@/lib/supabase/actions"

export default function Navbar() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  // Get user session
  useEffect(() => {
    async function getUser() {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      setUser(session?.user || null)

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

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Focus search input when opened
  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isSearchOpen])

  useEffect(() => {
    setMounted(true)
  }, [])

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen)
  }

  if (!mounted) return null

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          {/* Logo/Brand */}
          <div className="flex items-center">
            <div className="relative w-10 h-10 mr-3 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-white dark:bg-gray-900 rounded-lg m-0.5"></div>
              <span className="relative text-xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-emerald-500 to-teal-500">
                M
              </span>
            </div>
            <div className="text-xl font-bold">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-500">
                Modern
              </span>
              <span className="text-gray-700 dark:text-gray-300">.UI</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {["Home", "About", "Projects", "Contact"].map((item, index) => (
              <a
                key={index}
                href={`#${item.toLowerCase()}`}
                className="relative px-3 py-2 text-gray-700 dark:text-gray-300 hover:text-emerald-500 dark:hover:text-emerald-400 transition-colors group"
              >
                <span>{item}</span>
                <span className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500 scale-x-0 group-hover:scale-x-100 transition-transform origin-left"></span>
              </a>
            ))}

            {/* Resources Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <ModernButton variant="ghost" className="flex items-center gap-1 px-3 py-2">
                  Resources
                  <ChevronDown className="h-4 w-4" />
                </ModernButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Resources</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Documentation</DropdownMenuItem>
                <DropdownMenuItem>Tutorials</DropdownMenuItem>
                <DropdownMenuItem>Blog</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Community</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-2">
            {/* Search toggle */}
            <ModernButton
              variant="ghost"
              size="icon"
              onClick={toggleSearch}
              className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Search className="h-5 w-5" />
              <span className="sr-only">Search</span>
            </ModernButton>

            {/* Notifications */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <ModernButton
                  variant="ghost"
                  size="icon"
                  className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 relative"
                >
                  <Bell className="h-5 w-5" />
                  <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-emerald-500">
                    <span className="text-[10px]">3</span>
                  </Badge>
                  <span className="sr-only">Notifications</span>
                </ModernButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-80">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {[
                  "New feature: Dark mode is now available!",
                  "Your project has been updated",
                  "Welcome to Modern UI!",
                ].map((notification, i) => (
                  <DropdownMenuItem key={i} className="py-2">
                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 mt-1.5 rounded-full bg-emerald-500 flex-shrink-0"></div>
                      <span>{notification}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Theme toggle */}
            <ModernButton
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 relative overflow-hidden"
            >
              <Sun
                className={`h-5 w-5 absolute transition-all ${theme === "dark" ? "rotate-0 scale-100 opacity-100" : "rotate-90 scale-0 opacity-0"}`}
              />
              <Moon
                className={`h-5 w-5 absolute transition-all ${theme === "dark" ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 opacity-100"}`}
              />
              <span className="sr-only">Toggle theme</span>
            </ModernButton>

            {/* User menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <ModernButton
                    variant="ghost"
                    size="icon"
                    className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 hidden md:flex"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.user_metadata?.avatar_url || "/placeholder.svg?height=32&width=32"} />
                      <AvatarFallback>{user.email?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                  </ModernButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>Settings</DropdownMenuItem>
                  <DropdownMenuItem>Billing</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <form action={signOut} className="w-full">
                      <button className="w-full text-left">Log out</button>
                    </form>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <ModernButton asChild size="sm" className="hidden md:flex">
                <Link href="/login">LOG IN</Link>
              </ModernButton>
            )}

            {/* Mobile menu button */}
            <ModernButton
              variant="ghost"
              size="icon"
              className="md:hidden rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={toggleMenu}
              aria-expanded={isMenuOpen}
            >
              <div className="relative w-6 h-6">
                <span
                  className={`absolute block h-0.5 bg-current transform transition-all duration-300 ease-in-out ${
                    isMenuOpen ? "rotate-45 top-3 w-6" : "w-6 top-2"
                  }`}
                ></span>
                <span
                  className={`absolute block w-6 h-0.5 bg-current transform transition-all duration-300 ease-in-out ${
                    isMenuOpen ? "opacity-0" : "opacity-100 top-3"
                  }`}
                ></span>
                <span
                  className={`absolute block h-0.5 bg-current transform transition-all duration-300 ease-in-out ${
                    isMenuOpen ? "-rotate-45 top-3 w-6" : "w-6 top-4"
                  }`}
                ></span>
              </div>
              <span className="sr-only">{isMenuOpen ? "Close menu" : "Open menu"}</span>
            </ModernButton>
          </div>
        </div>

        {/* Search overlay */}
        <div
          className={`absolute inset-x-0 top-full bg-white dark:bg-gray-900 shadow-lg transform transition-all duration-300 ${
            isSearchOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none"
          }`}
        >
          <div className="container mx-auto p-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                ref={searchInputRef}
                type="text"
                placeholder="Search for anything..."
                className="pl-10 pr-10 py-2 w-full bg-gray-100 dark:bg-gray-800 border-none rounded-full h-12"
              />
              <ModernButton
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2"
                onClick={toggleSearch}
              >
                <X className="h-4 w-4" />
              </ModernButton>
            </div>
            <div className="mt-2 text-sm text-gray-500">
              Try searching for: <span className="text-emerald-500">projects</span>,{" "}
              <span className="text-emerald-500">features</span>,{" "}
              <span className="text-emerald-500">documentation</span>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`fixed inset-0 bg-white dark:bg-gray-900 z-40 md:hidden transition-all duration-500 ${
            isMenuOpen ? "opacity-100 translate-x-0" : "opacity-0 translate-x-full pointer-events-none"
          }`}
        >
          {/* Close button at the top right */}
          <div className="absolute top-4 right-4">
            <ModernButton
              variant="ghost"
              size="icon"
              onClick={toggleMenu}
              className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="h-6 w-6" />
              <span className="sr-only">Close menu</span>
            </ModernButton>
          </div>

          <div className="flex flex-col h-full pt-20 pb-6 px-6">
            <div className="flex-1 flex flex-col">
              {["Home", "About", "Projects", "Contact", "Resources", "Blog"].map((item, index) => (
                <a
                  key={index}
                  href={`#${item.toLowerCase()}`}
                  className="py-4 text-2xl font-medium text-gray-700 dark:text-gray-300 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between"
                  onClick={toggleMenu}
                  style={{
                    transitionDelay: `${100 + index * 50}ms`,
                    opacity: isMenuOpen ? 1 : 0,
                    transform: isMenuOpen ? "translateX(0)" : "translateX(20px)",
                    transition: "opacity 500ms ease, transform 500ms ease",
                  }}
                >
                  <span>{item}</span>
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                </a>
              ))}
            </div>

            <div className="mt-auto">
              <div className="flex items-center justify-between py-4 border-t border-gray-100 dark:border-gray-800">
                {user ? (
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src={user.user_metadata?.avatar_url || "/placeholder.svg?height=40&width=40"} />
                      <AvatarFallback>{user.email?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.user_metadata?.full_name || "User Account"}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center">
                    <Avatar className="h-10 w-10 mr-3">
                      <AvatarImage src="/placeholder.svg?height=40&width=40" />
                      <AvatarFallback>U</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">Guest</p>
                      <p className="text-sm text-gray-500">Not signed in</p>
                    </div>
                  </div>
                )}
                <AuthButton />
              </div>

              <div className="flex items-center justify-between mt-6">
                <p className="text-sm text-gray-500">© 2025 Modern.UI</p>
                <div className="flex space-x-4">
                  <ModernButton variant="ghost" size="icon" className="h-8 w-8">
                    <Search className="h-4 w-4" />
                  </ModernButton>
                  <ModernButton
                    variant="ghost"
                    size="icon"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="h-8 w-8"
                  >
                    {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                  </ModernButton>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}
