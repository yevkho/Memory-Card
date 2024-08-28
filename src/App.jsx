import { useState, useEffect } from "react";
import "./App.css";

export default function App() {
  const [gameToggle, setGameToggle] = useState(true);
  const [bestScore, setBestScore] = useState(0);

  function handleGameToggle() {
    setGameToggle(!gameToggle);
  }

  return (
    <>
      <h2 className="gameTitle">Memory Card</h2>
      <div>Best Score: {bestScore}</div>

      {gameToggle && (
        <GameDisplay
          handleGameToggle={handleGameToggle}
          bestScore={bestScore}
          setBestScore={setBestScore}
        />
      )}
      {!gameToggle && (
        <GameDisplay
          handleGameToggle={handleGameToggle}
          bestScore={bestScore}
          setBestScore={setBestScore}
        />
      )}
    </>
  );
}

function GameDisplay({ handleGameToggle, bestScore, setBestScore }) {
  const [currentScore, setCurrentScore] = useState(0);
  const [gameCardArray, setGameCardArray] = useState([]);
  console.log(gameCardArray);

  const [displayCards, setDisplayCards] = useState([]);
  console.log(displayCards);

  useEffect(() => {
    // const pokemonIds = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    const pokemonIds = createRandomArray();

    let ignore = false;

    const fetchedPromises = pokemonIds.map((id) =>
      fetch(`https://pokeapi.co/api/v2//pokemon/${id}`)
        .then((rawData) => rawData.json())
        .then((processedData) => {
          const {
            id,
            name,
            sprites: {
              other: {
                "official-artwork": { front_default: png },
              },
            },
          } = processedData;
          return { id, name, png };
        })
        .catch((error) => {
          console.error(`Error fetching Pokémon with ID ${id}:`, error);
        })
    );

    Promise.all(fetchedPromises)
      .then((resolvedCardsArray) => {
        if (!ignore) {
          setDisplayCards(resolvedCardsArray);
        }
      })
      .catch((error) => console.error("Error fetching Pokémon data:", error));

    return () => {
      ignore = true;
    };
  }, []);

  function handleClick(e) {
    if (!gameCardArray.includes(`${e.target.closest("div").id}`)) {
      setCurrentScore(currentScore + 1);
      setGameCardArray([...gameCardArray, e.target.closest("div").id]);
      setDisplayCards(shuffleArray(displayCards));
    } else {
      alert(`Repeat hit: your score is ${currentScore}`);
      handleGameToggle();
      handleBestScore();
    }
  }

  function shuffleArray(array) {
    // const newDisplayArray = [...array];
    const newDisplayArray = JSON.parse(JSON.stringify(array)); //deep copy

    for (let i = newDisplayArray.length - 1; i > 0; i--) {
      let j = Math.floor(Math.random() * (i + 1));
      [newDisplayArray[i], newDisplayArray[j]] = [
        newDisplayArray[j],
        newDisplayArray[i],
      ];
    }

    return newDisplayArray;
  }

  function handleBestScore() {
    if (bestScore < currentScore) {
      setBestScore(currentScore);
    }
  }

  function createRandomArray() {
    const randomNumbers = new Set();

    while (randomNumbers.size < 10) {
      const num = Math.floor(Math.random() * 100) + 1;
      randomNumbers.add(num);
    }

    const uniqueRandomArray = Array.from(randomNumbers);
    console.log(uniqueRandomArray);
    return uniqueRandomArray;
  }

  return (
    <>
      <div>Current Score: {currentScore}</div>
      {displayCards[0] ? (
        <div className="cardContainer">
          {displayCards.map((card) => (
            <div
              key={card.id}
              id={card.id}
              className="card"
              onClick={handleClick}
            >
              <h3>{card.name}</h3>
              <img src={card.png} alt="" />
            </div>
          ))}
        </div>
      ) : (
        <h3>Loading...</h3>
      )}
    </>
  );
}
