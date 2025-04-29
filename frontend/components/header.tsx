"use client"

import { Headphones, History, User } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"

export function Header() {
  const pathname = usePathname()
  const isHistoryPage = pathname === "/history"
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = () => {
      const user = localStorage.getItem("user")
      if (user) {
        try {
          const userData = JSON.parse(user)
          setIsLoggedIn(!!userData.isLoggedIn)
        } catch (e) {
          setIsLoggedIn(false)
        }
      } else {
        setIsLoggedIn(false)
      }
    }

    // Check on initial load
    checkAuth()

    // Set up event listener for storage changes
    window.addEventListener("storage", checkAuth)

    // Custom event for auth changes within the same window
    window.addEventListener("authChange", checkAuth)

    return () => {
      window.removeEventListener("storage", checkAuth)
      window.removeEventListener("authChange", checkAuth)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    setIsLoggedIn(false)

    // Dispatch custom event to notify other components
    window.dispatchEvent(new Event("authChange"))

    // Redirect to login
    window.location.href = "/auth/login"
  }

  return (
    <header className="w-full bg-white border-b border-gray-100 shadow-sm py-4 px-6 z-10">
      <div className="max-w-7xl mx-auto flex items-center">
        <div className="flex items-center">
          <Link href="/" className="flex items-center">
            <div className="w-10 h-10 bg-[#6a50d3] rounded-full flex items-center justify-center mr-3">
              <Headphones className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">RealTone</h1>
          </Link>
        </div>

        <div className="ml-auto hidden md:flex space-x-4">
          <Link href="/about" className="text-gray-600 hover:text-[#6a50d3] transition-colors">
            О сервисе
          </Link>
          <Link href="/how-it-works" className="text-gray-600 hover:text-[#6a50d3] transition-colors">
            Как это работает
          </Link>
          <Link href="/contacts" className="text-gray-600 hover:text-[#6a50d3] transition-colors">
            Контакты
          </Link>
        </div>

        <div className="ml-4 flex items-center space-x-4">
          {isLoggedIn && !isHistoryPage && (
            <Link href="/history">
              <Button
                variant="outline"
                className="flex items-center gap-2 border-[#6a50d3] text-[#6a50d3] hover:bg-purple-50"
              >
                <History className="w-4 h-4" />
                История проверок
              </Button>
            </Link>
          )}

          {isLoggedIn ? (
            <Button variant="ghost" className="text-gray-600 hover:text-[#6a50d3]" onClick={handleLogout}>
              Выйти
            </Button>
          ) : (
            <Link href="/auth/login">
              <Button variant="ghost" className="flex items-center gap-2 text-gray-600 hover:text-[#6a50d3]">
                <User className="w-4 h-4" />
                Войти
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
