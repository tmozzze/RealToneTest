"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"

interface AuthCheckProps {
  children: React.ReactNode
}

export function AuthCheck({ children }: AuthCheckProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    const user = localStorage.getItem("user")
    const isLoggedIn = user ? JSON.parse(user).isLoggedIn : false

    // Public routes that don't require authentication
    const publicRoutes = ["/auth/login", "/auth/register", "/about", "/how-it-works", "/contacts"]

    const isPublicRoute = publicRoutes.includes(pathname)

    // If not logged in and trying to access protected routes
    if (!isLoggedIn && !isPublicRoute) {
      router.push("/auth/login")
    } else {
      setIsChecking(false)
    }

    // Listen for auth changes
    const handleAuthChange = () => {
      const updatedUser = localStorage.getItem("user")
      const updatedIsLoggedIn = updatedUser ? JSON.parse(updatedUser).isLoggedIn : false

      if (!updatedIsLoggedIn && !isPublicRoute) {
        router.push("/auth/login")
      }
    }

    window.addEventListener("authChange", handleAuthChange)
    window.addEventListener("storage", handleAuthChange)

    return () => {
      window.removeEventListener("authChange", handleAuthChange)
      window.removeEventListener("storage", handleAuthChange)
    }
  }, [pathname, router])

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-white to-purple-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#6a50d3]"></div>
      </div>
    )
  }

  return <>{children}</>
}
