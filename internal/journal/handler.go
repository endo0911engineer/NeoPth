package journal

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"latency-lens/internal/auth"
	"latency-lens/internal/llm"
	"net/http"
)

type JournalHandler struct {
	db *sql.DB
}

func NewJournalHandler(db *sql.DB) *JournalHandler {
	return &JournalHandler{db: db}
}

func (h *JournalHandler) HandleJournal(w http.ResponseWriter, r *http.Request) {
	switch r.Method {
	case http.MethodPost:
		h.CreateEntry(w, r)
	case http.MethodGet:
		h.ListEntries(w, r)
	default:
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
	}
}

func (h *JournalHandler) CreateEntry(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value(auth.UserIDContextKey).(int64)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	var req struct {
		Content      string `json:"content"`
		Emotion      string `json:"emotion"`
		EmotionScore int    `json:"emotion_score"`
		Advice       string `json:"advice"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	query := `
		INSERT INTO journal_entries (user_id, content, emotion, emotion_score, advice, created_at)
		VALUES (?, ?, ?, ?, ?, datetime('now'))
	`
	_, err := h.db.Exec(query, userID, req.Content, req.Emotion, req.EmotionScore, req.Advice)
	if err != nil {
		http.Error(w, "failed to save journal", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusCreated)
}

func (h *JournalHandler) ListEntries(w http.ResponseWriter, r *http.Request) {
	userID, ok := r.Context().Value(auth.UserIDContextKey).(int64)
	if !ok {
		http.Error(w, "Unauthorized", http.StatusUnauthorized)
		return
	}

	rows, err := h.db.Query(`
		SELECT id, content, emotion, emotion_score, advice, created_at
		FROM journal_entries
		WHERE user_id = ?
		ORDER BY created_at DESC
	`, userID)
	if err != nil {
		http.Error(w, "failed to fetch entries", http.StatusInternalServerError)
		return
	}
	defer rows.Close()

	var entries []JournalEntry
	for rows.Next() {
		var e JournalEntry
		e.UserID = userID
		if err := rows.Scan(&e.ID, &e.Content, &e.Emotion, &e.EmotionScore, &e.Advice, &e.CreatedAt); err != nil {
			http.Error(w, "scan error", http.StatusInternalServerError)
			return
		}
		entries = append(entries, e)
	}

	if entries == nil {
		entries = []JournalEntry{}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(entries)
}

func (h *JournalHandler) AnalyzeEntry(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Content string `json:"content"`
	}
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	emotion, score, advice, err := llm.AnalyzeEmotion(req.Content)
	if err != nil {
		http.Error(w, "failed to analyze emotion", http.StatusInternalServerError)
		return
	}

	resp := map[string]interface{}{
		"emotion":      emotion,
		"emotionScore": score,
		"advice":       advice,
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func (h *JournalHandler) WeeklyAnalysis(w http.ResponseWriter, r *http.Request) {
	var req struct {
		Entries []struct {
			Content string `json:"content"`
		} `json:"entries"`
	}

	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}

	type EmotionData struct {
		Day     string `json:"day"`
		Score   int    `json:"score"`
		Emotion string `json:"emotion"`
	}

	var results []EmotionData
	for i, entry := range req.Entries {
		emotion, score, _, err := llm.AnalyzeEmotion(entry.Content)
		if err != nil {
			http.Error(w, "emotion analysis failed", http.StatusInternalServerError)
			return
		}
		results = append(results, EmotionData{
			Day:     fmt.Sprintf("Day %d", i+1),
			Score:   score,
			Emotion: emotion,
		})
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(results)
}
