import React, { useState, useEffect } from "react";

import { GrRefresh } from "react-icons/gr";
import "./TypingBox.scss";

const TypingBox = ({ words }) => {
  const [typedWords, setTypedWords] = useState("");
  const [wordList, setWordList] = useState([]);
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const [numWords, setNumWords] = useState(25);
  const [totalTyped, setTotalTyped] = useState(0);
  const [correctTyped, setCorrectTyped] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [correctIndices, setCorrectIndices] = useState(new Set());

  useEffect(() => {
    generateRandomWords(numWords);
    updateWpm();
  }, [words, numWords]);

  const generateRandomWords = (wordCount) => {
    if (!words || words.length === 0) return;

    const randomWords = [];
    for (let i = 0; i < wordCount; i++) {
      randomWords.push(words[Math.floor(Math.random() * words.length)]);
    }
    setWordList(randomWords);

    setTotalTyped(totalTyped + 1);
  };

  const updateWpm = () => {
    const endTime = Date.now();
    const duration = (endTime - startTime) / 1000 / 60;
    setWpm(Math.floor(currentWordIndex / duration));
  };

  const handleChange = (e) => {
    if (!startTime) {
      setStartTime(Date.now());
    }

    const typed = e.target.value;
    setTypedWords(typed);

    if (typed.endsWith(" ") && currentWordIndex < wordList.length) {
      const isCorrect = typed.trim() === wordList[currentWordIndex];
      if (isCorrect) {
        setCorrectTyped(correctTyped + typed.trim().length);
        setCorrectIndices((prev) => new Set([...prev, currentWordIndex]));
      }
      setTypedWords("");
      setCurrentWordIndex(currentWordIndex + 1);
      setTotalTyped(totalTyped + typed.trim().length);
      updateWpm();
      setAccuracy(Math.floor((correctTyped / totalTyped) * 100));

      // Check if the user has finished typing all the words in the word list
      if (currentWordIndex + 1 === wordList.length) {
        generateRandomWords(numWords);
        setCurrentWordIndex(0);
        setStartTime(null);
      }
    }
  };

  const refreshPage = () => {
    window.location.reload(false);
  };

  useEffect(() => {
    if (totalTyped > 0) {
      setAccuracy(Math.floor((correctTyped / totalTyped) * 100));
    }
  }, [correctTyped, totalTyped]);

  const handleWordCountChange = (wordCount) => {
    setNumWords(wordCount);
  };

  return (
    <>
      <div className="container">
        <div className="typing-nav">
          <div className="typing-length">
            <ul>
              {[10, 25, 50, 100, 250].map((count, index) => (
                <li key={count}>
                  <span
                    className={numWords === count ? "active" : ""}
                    onClick={() => handleWordCountChange(count)}
                  >
                    {count}
                  </span>
                  {index < 4 && <span className="separator">/</span>}
                </li>
              ))}
            </ul>
          </div>
          <div className="typing-score">
            <p>WPM: {wpm}</p>
            <p>/</p>
            <p>ACC: {accuracy}</p>
          </div>
        </div>
        <div className="typing-box">
          <div className="word-list">
            {wordList.map((word, index) => (
              <span
                key={index}
                className={
                  index < currentWordIndex
                    ? correctIndices.has(index)
                      ? "correct"
                      : "incorrect"
                    : index === currentWordIndex
                    ? "current"
                    : ""
                }
              >
                {word + " "}
              </span>
            ))}
          </div>
          <div className="input-container">
            <input
              type="text"
              className={
                "typing-input " +
                (typedWords.trim() ===
                wordList[currentWordIndex]?.slice(0, typedWords.length).trim()
                  ? "correct-input"
                  : "incorrect-input")
              }
              value={typedWords}
              onChange={handleChange}
              autoFocus
            />
            <div className="refresh">
              <GrRefresh
                className="refresh-icon"
                onClick={(e) => refreshPage()}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default TypingBox;
