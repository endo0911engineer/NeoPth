"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Brain, TrendingUp, Heart, MessageSquare, BarChart3, User, LogOut, Lightbulb, Clock, Save } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts"
import { useRouter } from "next/navigation"
import { analyzeJournal, analyzeWeeklyEmotions, fetchDiaryEntries, saveJournal } from "@/service/api"
import { DiaryEntry, EmotionData } from "@/types/model"

export default function DashboardPage() {
  const [diaryContent, setDiaryContent] = useState("")
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [currentEmotion, setCurrentEmotion] = useState<string | null>(null)
  const [currentAdvice, setCurrentAdvice] = useState<string | null>(null)
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([])
  const [weeklyData, setWeeklyData] = useState<EmotionData[]>([])
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)

  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    if (!storedToken) {
      router.push("/signin")
      return
    }
    setToken(storedToken)

    const init = async () => {
      try {
        const entries = await fetchDiaryEntries(storedToken)
        setDiaryEntries(entries)
      } catch (err) {
        console.error("Error loading entries:", err)
      }
    }

    init()
  }, [])


  const handleSaveJournal = async () => {
    if (!diaryContent.trim()) return
    setIsSaving(true)
    
    try {
      const { emotion, emotionScore, advice } = await analyzeJournal(token, diaryContent)

      setCurrentEmotion(emotion)
      setCurrentAdvice(advice)

      if (!token) {
        alert("ログイン情報がありません")
        return
      }

      await saveJournal(token, {
          content: diaryContent,
          emotion,
          emotionScore,
          advice,
        })

      const newEntry: DiaryEntry = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString(),
        content: diaryContent,
        emotion,
        emotionScore,
        advice,
      }
  
      setDiaryEntries((prev) => [newEntry, ...prev])
      setDiaryContent("")
    } catch (error) {
      alert("An error occurred while saving the entry.")
    } finally {
      setIsSaving(false)
    }
  }

  const handleAnalyzeWeeklyEmotions = async () => {
    if (diaryEntries.length === 0) return
    setIsAnalyzing(true)
    
    try {
      const recentEntries = diaryEntries.slice(0, 7).reverse()
      const result = await analyzeWeeklyEmotions(token, recentEntries)
      setWeeklyData(result)
    } catch (err) {
      alert("Error analyzing weekly emotions")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const getEmotionBadgeColor = (emotion: string) => {
    const colors: Record<string, string> = {
      happy: "bg-green-900/50 text-green-300 border-green-600",
      sad: "bg-blue-900/50 text-blue-300 border-blue-600",
      anxious: "bg-yellow-900/50 text-yellow-300 border-yellow-600",
      hopeful: "bg-purple-900/50 text-purple-300 border-purple-600",
      frustrated: "bg-red-900/50 text-red-300 border-red-600",
      calm: "bg-teal-900/50 text-teal-300 border-teal-600",
      motivated: "bg-orange-900/50 text-orange-300 border-orange-600",
      neutral: "bg-gray-900/50 text-gray-300 border-gray-600",
    }
    return colors[emotion] || "bg-gray-900/50 text-gray-300 border-gray-600"
  }

  const averageScore = weeklyData.reduce((acc, day) => acc + day.score, 0) / weeklyData.length

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Brain className="h-8 w-8 text-blue-400" />
              <h1 className="text-2xl font-bold">NeoPath Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-gray-300">
                <User className="h-5 w-5" />
                <span>Welcome back</span>
              </div>
              <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Diary Input */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <MessageSquare className="h-5 w-5 mr-2 text-blue-400" />
                  Daily Journal Entry
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Share your thoughts and feelings. Our AI will analyze your emotions and provide personalized guidance.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="How are you feeling today? What's on your mind? Share your thoughts, experiences, or any challenges you're facing..."
                  value={diaryContent}
                  onChange={(e) => setDiaryContent(e.target.value)}
                  className="min-h-[200px] bg-gray-800 border-gray-600 text-white placeholder:text-gray-500 focus:border-blue-500 focus:ring-blue-500"
                />
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">{diaryContent.length} characters</span>
                  <div className="flex space-x-3">
                    <Button
                      onClick={handleSaveJournal}
                      disabled={!diaryContent.trim() || isSaving}
                      className="bg-green-600 hover:bg-green-700 text-white"
                    >
                      {isSaving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Journal
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={handleAnalyzeWeeklyEmotions}
                      disabled={!diaryEntries || diaryEntries.length === 0 || isAnalyzing}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      {isAnalyzing ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <BarChart3 className="h-4 w-4 mr-2" />
                          Analyze Weekly Emotions
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Weekly Emotion Chart */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <BarChart3 className="h-5 w-5 mr-2 text-green-400" />
                  Weekly Emotion Tracking
                </CardTitle>
                <CardDescription className="text-gray-400">Your emotional journey over the past week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={weeklyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis dataKey="day" stroke="#9CA3AF" />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#1F2937",
                          border: "1px solid #374151",
                          borderRadius: "8px",
                          color: "#F3F4F6",
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="score"
                        stroke="#3B82F6"
                        strokeWidth={3}
                        dot={{ fill: "#3B82F6", strokeWidth: 2, r: 6 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-4 flex items-center justify-between">
                  <div className="text-sm text-gray-400">
                    Average Score: <span className="text-white font-semibold">{averageScore.toFixed(1)}/100</span>
                  </div>
                  <Progress value={averageScore} className="w-32" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Analysis Results */}
          <div className="space-y-6">
            {/* Current Emotion Analysis */}
            {currentEmotion && (
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Heart className="h-5 w-5 mr-2 text-red-400" />
                    Current Emotion
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <Badge className={`text-lg px-4 py-2 ${getEmotionBadgeColor(currentEmotion)}`}>
                      {currentEmotion.charAt(0).toUpperCase() + currentEmotion.slice(1)}
                    </Badge>
                    <div className="text-sm text-gray-400">Detected from your latest journal entry</div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* AI Advice */}
            {currentAdvice && (
              <Card className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center text-white">
                    <Lightbulb className="h-5 w-5 mr-2 text-yellow-400" />
                    Personalized Guidance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300 leading-relaxed">{currentAdvice}</p>
                </CardContent>
              </Card>
            )}

            {/* Recent Entries */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <Clock className="h-5 w-5 mr-2 text-purple-400" />
                  Recent Entries
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!diaryEntries || diaryEntries.length === 0 ? (
                  <p className="text-gray-400 text-center py-4">
                    No entries yet. Start by writing your first journal entry!
                  </p>
                ) : (
                  diaryEntries.slice(0, 3).map((entry) => (
                    <div key={entry.id} className="border-l-4 border-blue-500 pl-4 py-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-400">{entry.date}</span>
                        <Badge className={`text-xs ${getEmotionBadgeColor(entry.emotion)}`}>{entry.emotion}</Badge>
                      </div>
                      <p className="text-gray-300 text-sm line-clamp-2">{entry.content.substring(0, 100)}...</p>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <TrendingUp className="h-5 w-5 mr-2 text-green-400" />
                  Progress Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Total Entries</span>
                  <span className="text-white font-semibold">{diaryEntries ? diaryEntries.length : 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">This Week</span>
                  <span className="text-white font-semibold">7 days</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Streak</span>
                  <span className="text-green-400 font-semibold">5 days</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}