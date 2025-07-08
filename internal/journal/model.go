package journal

type JournalEntry struct {
	ID           int64  `json:"id"`
	UserID       int64  `json:"user_id"`
	Content      string `json:"content"`
	Emotion      string `json:"emotion"`
	EmotionScore int    `json:"emotionScore"`
	Advice       string `json:"advice"`
	CreatedAt    string `json:"date"`
}
