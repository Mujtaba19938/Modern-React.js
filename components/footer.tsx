"use client"

import { Github, Twitter, Linkedin, Mail } from "lucide-react"
import { ModernButton } from "@/components/ui/modern-button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function Footer() {
  const [isSubscribing, setIsSubscribing] = useState(false)

  const handleSubscribe = () => {
    setIsSubscribing(true)
    setTimeout(() => setIsSubscribing(false), 1500)
  }

  return (
    <footer className="bg-gray-100 dark:bg-gray-900 py-16 px-4" id="contact">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-500">
              Get in Touch
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md">
              Have a project in mind? Let's create something amazing together. Reach out and let's start a conversation.
            </p>

            <div className="flex space-x-4">
              <ModernButton variant="ghost" size="icon" className="rounded-full">
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </ModernButton>
              <ModernButton variant="ghost" size="icon" className="rounded-full">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </ModernButton>
              <ModernButton variant="ghost" size="icon" className="rounded-full">
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </ModernButton>
              <ModernButton variant="ghost" size="icon" className="rounded-full">
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </ModernButton>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-semibold mb-6">Subscribe to Newsletter</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              Stay updated with our latest projects and technologies.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Input
                type="email"
                placeholder="Enter your email"
                className="bg-white dark:bg-gray-800 rounded-full h-12 px-6"
              />
              <ModernButton isLoading={isSubscribing} onClick={handleSubscribe}>
                SUBSCRIBE
              </ModernButton>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-500 mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </div>

        <div className="border-t border-gray-200 dark:border-gray-800 mt-12 pt-8 text-center text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} Modern. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
