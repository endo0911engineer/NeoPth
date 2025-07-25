"use client"

import { useState, type ChangeEvent } from "react"
import { useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { signupUser } from "@/service/api"

export default function SignupPage() {
  const [email, setEmail] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  const handleSignup = async () => {
    setIsLoading(true)
    setMessage("")

    try {
      await signupUser(email, username, password)
      setMessage("Signup successful! Redirecting to sign in...")
      setTimeout(() => {
        router.push("/signin")
      }, 2000)
    } catch (error: any) {
      setMessage(error.message || "Unexpected error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-900 border-gray-700">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center text-white">Create Account</CardTitle>
          <CardDescription className="text-center text-gray-400">
            Enter your details to create your new account
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
            <Label htmlFor="username" className="text-gray-300">
              Username
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)}
                className="pl-10 bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-gray-300">
              Password
            </Label>
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
            onClick={handleSignup}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>

          {message && (
            <Alert className="bg-gray-800 border-gray-600">
              <AlertDescription className="text-gray-300">{message}</AlertDescription>
            </Alert>
          )}

          <p className="text-center text-sm text-gray-400">
            Already have an account?{" "}
            <button
              onClick={() => router.push("/signin")}
              className="text-blue-400 hover:text-blue-300 underline transition-colors"
            >
              Sign in
            </button>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
