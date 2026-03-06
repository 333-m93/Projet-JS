package main

import (
	"log"
	"net/http"
)

func StartServer(port string) error {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "../test.html")
	})

	log.Printf("Serveur lancé sur http://localhost:%s", port)
	return http.ListenAndServe(":"+port, nil)
}
