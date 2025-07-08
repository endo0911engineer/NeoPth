"use client"

import { useState, type ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { signinUser } from "@/service/api"

export default function SigninPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleSignin = async () => {
    setIsLoading(true)
    setMessage("")

    try {
      const data = await signinUser(email, password)
      localStorage.setItem("token", data.token)
      setMessage("Login successful! Redirecting...")
      setTimeout(() => {
        router.push("/dashboard")
      }, 1500)
    } catch (error: any) {
      console.error("Signin error:", error)
      setMessage(error.message || "An unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-900 border-gray-700">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-white">Welcome Back</CardTitle>
          <CardDescription className="text-center text-gray-400">
            Enter your credentials to access your account
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-300">
              Email Address
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-gray-300">
                Password
              </Label>
              <button className="text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors">
                Forgot password?
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                className="pl-10 pr-10 bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 h-4 w-4 text-gray-400 hover:text-gray-300 transition-colors"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <Button
            onClick={handleSignin}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 transition-all duration-200 transform hover:scale-[1.02]"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Signing In...</span>
              </div>
            ) : (
              "Sign In"
            )}
          </Button>

          {message && (
            <Alert
              className={`${
                message.includes("successful") ? "bg-green-900/50 border-green-600" : "bg-red-900/50 border-red-600"
              }`}
            >
              <AlertDescription className={`${message.includes("successful") ? "text-green-300" : "text-red-300"}`}>
                {message}
              </AlertDescription>
            </Alert>
          )}

          <div className="text-center text-sm text-gray-400">
            {"Don't have an account? "}
            <button
              onClick={() => router.push("/signup")}
              className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-colors"
            >
              Sign up
            </button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}