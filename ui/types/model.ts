export interface DiaryEntry {
  id: string
  date: string
  content: string
  emotion: string
  emotionScore: number
  advice: string
}

export interface EmotionData {
  date: string
  emotion: string
  score: number
}