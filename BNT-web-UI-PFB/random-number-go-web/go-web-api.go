package main

import (
	crand "crypto/rand" // import crypto/rand as crand
	"encoding/hex"
	"fmt"
	"math/big"
	"math/rand"
	"net/http"
)

// generateRandSeed generates random integer to use as seed
func generateRandSeed() int64 {
	seed, err := crand.Int(crand.Reader, big.NewInt(99999))
	if err != nil {
		panic(err)
	}
	return seed.Int64()
}

// generateRandHexEncodedNamespaceID generates 8 random bytes and
// returns them as a hex-encoded string.
func generateRandHexEncodedNamespaceID() string {
	nID := make([]byte, 8)
	_, err := rand.Read(nID)
	if err != nil {
		panic(err)
	}
	return hex.EncodeToString(nID)
}

// generateRandMessage generates a message of an arbitrary length (up to 100 bytes)
// and returns it as a hex-encoded string.
func generateRandMessage() string {
	lenMsg := rand.Intn(100)
	msg := make([]byte, lenMsg)
	_, err := rand.Read(msg)
	if err != nil {
		panic(err)
	}
	return hex.EncodeToString(msg)
}

func handler(w http.ResponseWriter, r *http.Request) {
	// generate a random seed
	seed := generateRandSeed()

	// initialize random number generator with seed
	rand.Seed(seed)

	// generate a random namespace ID
	nID := generateRandHexEncodedNamespaceID()

	// generate a random hex-encoded message
	msg := generateRandMessage()

	// create response JSON
	resp := fmt.Sprintf(`{"My seed value": %d, "My hex-encoded namespace ID": "%s", "My hex-encoded message": "%s"}`, seed, nID, msg)

	// set headers
	w.Header().Set("Content-Type", "application/json")

	// send response
	w.Write([]byte(resp))
}

func main() {
	// register request handler
	http.HandleFunc("/", handler)

	// start listening
	fmt.Println("Server started on localhost:8080")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		panic(err)
	}
}
