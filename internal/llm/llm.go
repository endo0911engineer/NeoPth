package llm

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
)

type MistralRequest struct {
	Model    string    `json:"model"`
	Messages []Message `json:"messages"`
}

type Message struct {
	Role    string `json:"role"`
	Content string `json:"content"`
}

type MistralResponse struct {
	Choices []struct {
		Message struct {
			Content string `json:"content"`
		} `json:"message"`
	} `json:"choices"`
}

// AnalyzeEmotion takes a diary entry and returns emotion, score, and advice
func AnalyzeEmotion(entry string) (string, int, string, error) {
	prompt := fmt.Sprintf(`
Please analyze the following diary entry and return the result in JSON format with the following fields:

1. "emotion": an emotion category such as "happy", "sad", "anxious", "hopeful", "frustrated", "calm", "motivated" or "neutoral"
2. "score": an integer between 0 and 100 representing the emotional intensity
3. "advice": a short piece of advice in English to help the user process or respond to the emotion

Example format:
{
  "emotion": "happy",
  "score": 85,
  "advice": "Reflect on what made you happy today and try to incorporate more of it tomorrow."
}

Diary entry:
%s
`, entry)

	reqBody := MistralRequest{
		Model: "mistralai/mistral-7b-instruct:free",
		Messages: []Message{
			{Role: "system", Content: "You are an AI assistant that analyzes emotional tone in daily journal entries and provides supportive advice."},
			{Role: "user", Content: prompt},
		},
	}

	b, _ := json.Marshal(reqBody)

	req, _ := http.NewRequest("POST", "https://openrouter.ai/api/v1/chat/completions", bytes.NewBuffer(b))
	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Authorization", "Bearer "+os.Getenv("OPENROUTER_API_KEY"))

	res, err := http.DefaultClient.Do(req)
	if err != nil {
		return "", 0, "", err
	}
	defer res.Body.Close()

	bodyBytes, err := io.ReadAll(res.Body)
	if err != nil {
		return "", 0, "", err
	}
	if res.StatusCode != http.StatusOK {
		return "", 0, "", fmt.Errorf("OpenRouter error: %s", string(bodyBytes))
	}

	var parsed MistralResponse
	if err := json.Unmarshal(bodyBytes, &parsed); err != nil {
		return "", 0, "", err
	}

	if len(parsed.Choices) == 0 {
		return "", 0, "", fmt.Errorf("no response from Mistral")
	}

	var result struct {
		Emotion string `json:"emotion"`
		Score   int    `json:"score"`
		Advice  string `json:"advice"`
	}
	if err := json.Unmarshal([]byte(parsed.Choices[0].Message.Content), &result); err != nil {
		return "", 0, "", fmt.Errorf("failed to parse LLM output: %v", err)
	}

	return result.Emotion, result.Score, result.Advice, nil
}
