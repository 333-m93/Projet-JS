package main

import "log"
import "net/http"

func main() {
	fs := http.FileServer(http.Dir("."))
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if p := map[string]string{"/": "index", "/index.html": "index", "/rules": "rules", "/rules.html": "rules", "/game": "game", "/game.html": "game"}[r.URL.Path]; p != "" { http.ServeFile(w, r, "html/"+p+".html"); return }
		fs.ServeHTTP(w, r)
	})
	log.Println("Serveur lance sur http://localhost:8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
