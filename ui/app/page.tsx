import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Brain, Heart, TrendingUp, Shield, BookOpen } from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-black/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-blue-400" />
              <h1 className="text-2xl font-bold">MindPath</h1>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="#features" className="text-gray-300 hover:text-white transition-colors">
                Features
              </Link>
              <Link href="#how-to-use" className="text-gray-300 hover:text-white transition-colors">
                How to Use
              </Link>
              <Link href="#about" className="text-gray-300 hover:text-white transition-colors">
                About
              </Link>
            </nav>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white bg-transparent"
              >
                <Link href="/signin">Sign In</Link>
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-green-400 bg-clip-text text-transparent">
              Listen to Your Heart
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
              Rehabilitation Support App Using Emotion Analysis Technology
              <br />
              Visualize changes in your emotions and support positive growth
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg">
                <Link href="/signup">Get Started Now</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 hover:text-white px-8 py-4 text-lg bg-transparent"
              >
                <Link href="#how-to-use">See How It Works</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 bg-gray-900/50">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">Key Features</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <Heart className="h-12 w-12 text-red-400 mb-4" />
                <CardTitle className="text-white">Emotion Analysis</CardTitle>
                <CardDescription className="text-gray-400">
                  Record daily emotional changes and AI analyzes patterns for visualization
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <TrendingUp className="h-12 w-12 text-green-400 mb-4" />
                <CardTitle className="text-white">Growth Tracking</CardTitle>
                <CardDescription className="text-gray-400">
                  View emotional changes in graphs and feel your own growth
                </CardDescription>
              </CardHeader>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <Shield className="h-12 w-12 text-blue-400 mb-4" />
                <CardTitle className="text-white">Privacy Protection</CardTitle>
                <CardDescription className="text-gray-400">
                  All data is encrypted and privacy is strictly protected
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section id="how-to-use" className="py-16 px-4">
        <div className="container mx-auto">
          <h3 className="text-3xl font-bold text-center mb-12">How to Use</h3>
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  1
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2">Create Account</h4>
                  <p className="text-gray-400">
                    First, create an account. Personal information is kept to a minimum and managed securely.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-12 h-12 bg-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  2
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2">Daily Recording</h4>
                  <p className="text-gray-400">
                    Easily record daily emotions and events. Input casually through text or multiple choice options.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  3
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2">View Analysis Results</h4>
                  <p className="text-gray-400">
                    AI analyzes emotional patterns, and you can check your growth trajectory through graphs and reports.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-6">
                <div className="flex-shrink-0 w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                  4
                </div>
                <div>
                  <h4 className="text-xl font-semibold mb-2">Continuous Improvement</h4>
                  <p className="text-gray-400">
                    Based on analysis results, receive advice to aim for better mental states.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 px-4 bg-gray-900/50">
        <div className="container mx-auto text-center">
          <div className="max-w-3xl mx-auto">
            <BookOpen className="h-16 w-16 text-blue-400 mx-auto mb-6" />
            <h3 className="text-3xl font-bold mb-6">About MindPath</h3>
            <p className="text-lg text-gray-300 leading-relaxed mb-8">
              MindPath is an emotion analysis app designed for rehabilitation support. Using the latest AI technology,
              it analyzes users' emotional changes and supports positive growth. Privacy is our top priority, providing
              a safe and reliable environment.
            </p>
            <div className="flex justify-center">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4">
                <Link href="/signup">Get Started Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-8 px-4">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Brain className="h-6 w-6 text-blue-400" />
            <span className="text-lg font-semibold">MindPath</span>
          </div>
          <p className="text-gray-400 text-sm">© 2024 MindPath. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
