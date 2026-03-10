"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff } from "lucide-react"

export function LoginForm() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log("Login attempt:", { email, password })
    router.push("/dashboard")
    setIsLoading(false)
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex flex-col justify-center">
        <div className="space-y-6 w-full">
          <div className="space-y-1">
            <h1 className="text-3xl font-bold text-gray-900">Login</h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field with shadow */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-700">
                User Name
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 bg-white border-0 shadow-md"
              />
            </div>

            {/* Password Field with shadow */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-gray-700">
                  Password
                </Label>
                <button type="button" className="text-sm text-primary hover:underline">
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="h-12 pr-10 bg-white border-0 shadow-md"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                </button>
              </div>
            </div>

            {/* Login Button with shadow */}
            <div className="flex justify-center pt-2">
              <Button
                type="submit"
                className="w-full max-w-[200px] h-9 font-medium shadow-lg hover:shadow-xl transition-shadow"
                disabled={isLoading}
                style={{ backgroundColor: "#FF8F5C", color: "white" }}
              >
                {isLoading ? "Logging in..." : "Login"}
              </Button>
            </div>

            {/* Security Message */}
            <div className="mt-6">
              <p className="text-xs text-center text-gray-700">
                🔒 Your Data is Secure and Encrypted
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
