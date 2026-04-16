package main

import (
	"log"
	"net/http"
)

func main() {
	fs := http.FileServer(http.Dir("."))
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		switch r.URL.Path {
		case "/", "/index.html":
			http.ServeFile(w, r, "html/index.html")
		case "/rules", "/rules.html":
			http.ServeFile(w, r, "html/rules.html")
		case "/game", "/game.html":
			http.ServeFile(w, r, "html/game.html")
		default:
			fs.ServeHTTP(w, r)
		}
	})
	log.Println("Serveur lancé sur http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
