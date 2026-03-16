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
		if r.URL.Path == "/" {
			http.ServeFile(w, r, filepath.Join(rootDir, "html", "index.html"))
			return
		}
		fileServer.ServeHTTP(w, r)
	})

	log.Printf("Serveur lancé sur http://localhost:%s", port)
	return http.ListenAndServe(":"+port, nil)
}
