import CompleteTheSentence from "./assets/CompleteTheSentence.png"
import RepeatTheSentence from "./assets/RepeatTheSentence.png"
export const serverURL = import.meta.env.VITE_API_HOST + ":" + import.meta.env.VITE_API_PORT 

// Used by Decks in containers for drop down to select what exercise to use
export const mapActivityToNumbers = {
    "Complete The Sentence" : 0,
    "Repeat The Sentence": 1
}

export const numbersToActivityName = {
    0 : "Complete The Sentence",
    1: "Repeat The Sentence"
}

export const activitiesMetaData = {
    0 : {name:"Complete The Sentence", description:"Drag the correct words from the pool into the empty spaces to complete the sentences.", icon:CompleteTheSentence},
    1: {name:"Repeat The Sentence", description:"Repeat the spoken sentence", icon:RepeatTheSentence}
}

export const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];