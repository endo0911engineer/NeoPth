import { DiaryEntry, EmotionData } from "@/types/model"

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"

export async function signupUser(email: string, username: string, password: string) {
  const response = await fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, username, password }),
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || "Signup failed")
  }

  return data
}

export async function signinUser(email: string, password: string) {
  const res = await fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  })

  const data = await res.json()
  if (!res.ok || !data.token) {
    throw new Error(data.message || "Signin failed")
  }

  return data
}

export async function fetchDiaryEntries(token: string | null): Promise<DiaryEntry[]> {
  const res = await fetch(`${BASE_URL}/journal`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!res.ok) throw new Error("Failed to fetch entries")
  return res.json()
}

export async function analyzeJournal(token: string | null, content: string) {
  const res = await fetch(`${BASE_URL}/journal/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  })

  if (!res.ok) throw new Error("Failed to analyze journal")
  return res.json()
}

export async function saveJournal(token: string | null, entry: Omit<DiaryEntry, "id" | "date">) {
  const res = await fetch(`${BASE_URL}/journal`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(entry),
  })

  if (!res.ok) throw new Error("Failed to save journal")
  return res.json()
}

export async function analyzeWeeklyEmotions(token: string | null, entries: DiaryEntry[]): Promise<EmotionData[]> {
  const res = await fetch(`${BASE_URL}/journal/weekly-analysis`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ entries }),
  })

  if (!res.ok) throw new Error("Failed to analyze weekly emotions")
  return res.json()
}