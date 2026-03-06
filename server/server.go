package main

import (
	"log"
	"net/http"
)

func StartServer(port string) error {
	http.Handle("/", http.FileServer(http.Dir("../html")))

	log.Printf("Serveur lancé sur http://localhost:%s", port)
	return http.ListenAndServe(":"+port, nil)
}
