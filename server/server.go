package main

import (
	"log"
	"net/http"
	"path/filepath"
)

func StartServer(port string) error {
	rootDir := filepath.Join("..")
	fileServer := http.FileServer(http.Dir(rootDir))

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		switch r.URL.Path {
		case "/", "/index.html":
			http.ServeFile(w, r, filepath.Join(rootDir, "html", "index.html"))
		case "/rules", "/rules.html":
			http.ServeFile(w, r, filepath.Join(rootDir, "html", "rules.html"))
		case "/game", "/game.html":
			http.ServeFile(w, r, filepath.Join(rootDir, "html", "game.html"))
		default:
			fileServer.ServeHTTP(w, r)
		}
	})

	log.Printf("Serveur lancé sur http://localhost:%s", port)
	return http.ListenAndServe(":"+port, nil)
}
