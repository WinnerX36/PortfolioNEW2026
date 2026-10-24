// Command portfolio serves the site in this repository over HTTP.
//
// The site is plain HTML/CSS/JS, so the server only serves the embedded
// files. Embedding keeps the binary self-contained: no asset paths to
// configure and nothing to copy alongside it.
//
//	go run .                    # http://127.0.0.1:8080
//	ADDR=0.0.0.0:8080 go run .  # listen on all interfaces
package main

import (
	"context"
	"embed"
	"errors"
	"io/fs"
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"
	"time"
)

//go:embed index.html assets
var content embed.FS

func main() {
	addr := os.Getenv("ADDR")
	if addr == "" {
		addr = "127.0.0.1:8080"
	}

	root, err := fs.Sub(content, ".")
	if err != nil {
		log.Fatalf("prepare embedded filesystem: %v", err)
	}

	mux := http.NewServeMux()
	mux.Handle("/", noStore(http.FileServer(http.FS(root))))
	mux.HandleFunc("/healthz", func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "text/plain; charset=utf-8")
		if _, err := w.Write([]byte("ok\n")); err != nil {
			log.Printf("healthz write: %v", err)
		}
	})

	srv := &http.Server{
		Addr:              addr,
		Handler:           mux,
		ReadHeaderTimeout: 5 * time.Second,
	}

	ctx, stop := signal.NotifyContext(context.Background(), os.Interrupt, syscall.SIGTERM)
	defer stop()

	go func() {
		<-ctx.Done()
		shutdownCtx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
		defer cancel()
		if err := srv.Shutdown(shutdownCtx); err != nil {
			log.Printf("shutdown: %v", err)
		}
	}()

	log.Printf("portfolio ready on http://%s", addr)
	if err := srv.ListenAndServe(); err != nil && !errors.Is(err, http.ErrServerClosed) {
		log.Fatalf("listen: %v", err)
	}
	log.Print("portfolio stopped")
}

// noStore keeps the browser from caching a page that is edited on disk.
func noStore(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Cache-Control", "no-store, must-revalidate")
		next.ServeHTTP(w, r)
	})
}
