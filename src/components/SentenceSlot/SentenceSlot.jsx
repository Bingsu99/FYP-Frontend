import SlotCounter from 'react-slot-counter';
import './SentenceSlot.css'

function SentenceSlot({words}) {
    const sentenceSpans = words.map((word, index) => (
        <span key={index}>{word}</span>
    ));

    const randomValue = getRandomSubarray(fillerWords, words.length)
    const randomInitialValue = randomValue.map((word, index) => (
        <span key={"r"+index}>{word}</span>
    ));
    

    return(
       <>
        <SlotCounter    
            startValue={randomInitialValue}
            value={sentenceSpans}
            charClassName="char"
            containerClassName="con"
            dummyCharacters={fillerWords}
            duration={3}
        />
       </>
    );
}

function getRandomSubarray(arr, size) {
    let shuffled = arr.slice(0).sort(() => 0.5 - Math.random());
    return shuffled.slice(0, size);
}

const fillerWords = [
    "Rainbow",
    "Butterfly",
    "Unicorn",
    "Sunshine",
    "Lollipop",
    "Daisy",
    "Puppy",
    "Kitten",
    "Raincoat",
    "Snowflake",
    "Balloon",
    "Bicycle",
    "Cupcake",
    "Puzzle",
    "Marbles",
    "Crayons",
    "Bubbles",
    "Teddy",
    "Giggles",
    "Picnic"
];

export default SentenceSlot;