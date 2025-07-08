package main

import (
	"database/sql"
	"latency-lens/internal/auth"
	"latency-lens/internal/journal"
	"latency-lens/internal/middleware"
	"net/http"
)

func SetupRouter(db *sql.DB) http.Handler {
	mux := http.NewServeMux()
	authHandler := auth.NewAuthHandler(db)
	journalHandler := journal.NewJournalHandler(db)

	// Public
	mux.Handle("/signup", middleware.WithCORS(http.HandlerFunc(authHandler.Signup)))
	mux.Handle("/signin", middleware.WithCORS(http.HandlerFunc(authHandler.Login)))

	// Protect
	mux.Handle("/me", middleware.WithCORS(auth.JWTAuthMiddleware(http.HandlerFunc(authHandler.Me))))

	mux.Handle("/journal", middleware.WithCORS(auth.JWTAuthMiddleware(http.HandlerFunc(journalHandler.HandleJournal))))
	mux.Handle("/journal/analyze", middleware.WithCORS(auth.JWTAuthMiddleware(http.HandlerFunc(journalHandler.AnalyzeEntry))))
	mux.Handle("/journal/weekly-analysis", middleware.WithCORS(auth.JWTAuthMiddleware(http.HandlerFunc(journalHandler.WeeklyAnalysis))))

	return mux
}
