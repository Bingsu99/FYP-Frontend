export const serverURL = import.meta.env.VITE_API_HOST + ":" + import.meta.env.VITE_API_PORT 

// Used by Decks in containers for drop down to select what exercise to use
export const mapActivityToNumbers = {
    "Complete The Sentence" : 0
}

// Used by Decks in containers to identify endpoint to create new activity
// To Depreciate and got through DecksManagement
export const mapNumbersToEndpoint = {
    0 : "CompleteSentenceDeck"
}

export const numbersToActivityName = {
    0 : "Complete The Sentence"
}