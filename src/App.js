import React, { useState, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [breakLength, setBreakLength] = useState(5);
  const [sessionLength, setSessionLength] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isSession, setIsSession] = useState(true);
  const timerRef = useRef(null);
  const audioRef = useRef(null);

  // Helper function to format time
  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Start/Stop Timer
  const handleStartStop = () => {
    if (isRunning) {
      clearInterval(timerRef.current);
      setIsRunning(false);
    } else {
      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime === 0) {
            audioRef.current.play();
            if (isSession) {
              setIsSession(false);
              return breakLength * 60;
            } else {
              setIsSession(true);
              return sessionLength * 60;
            }
          }
          return prevTime - 1;
        });
      }, 1000);
      setIsRunning(true);
    }
  };

  // Reset Timer
  const handleReset = () => {
    clearInterval(timerRef.current);
    setBreakLength(5);
    setSessionLength(25);
    setTimeLeft(25 * 60);
    setIsRunning(false);
    setIsSession(true);
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  // Increment/Decrement Break Length
  const handleBreakDecrement = () => {
    setBreakLength((prev) => (prev > 1 ? prev - 1 : 1));
  };

  const handleBreakIncrement = () => {
    setBreakLength((prev) => (prev < 60 ? prev + 1 : 60));
  };

  // Increment/Decrement Session Length
  const handleSessionDecrement = () => {
    setSessionLength((prev) => {
      const newLength = prev > 1 ? prev - 1 : 1;
      if (!isRunning && isSession) {
        setTimeLeft(newLength * 60);
      }
      return newLength;
    });
  };

  const handleSessionIncrement = () => {
    setSessionLength((prev) => {
      const newLength = prev < 60 ? prev + 1 : 60;
      if (!isRunning && isSession) {
        setTimeLeft(newLength * 60);
      }
      return newLength;
    });
  };

  return (
    <div className="App">
      <h1>25 + 5 Clock</h1>
      <div className="length-controls">
        <div className="break-control">
          <div id="break-label">Break Length</div>
          <div className="controls">
            <button id="break-decrement" onClick={handleBreakDecrement}>↓</button>
            <div id="break-length">{breakLength}</div>
            <button id="break-increment" onClick={handleBreakIncrement}>↑</button>
          </div>
        </div>
        <div className="session-control">
          <div id="session-label">Session Length</div>
          <div className="controls">
            <button id="session-decrement" onClick={handleSessionDecrement}>↓</button>
            <div id="session-length">{sessionLength}</div>
            <button id="session-increment" onClick={handleSessionIncrement}>↑</button>
          </div>
        </div>
      </div>
      <div className="timer">
        <div id="timer-label">{isSession ? 'Session' : 'Break'}</div>
        <div id="time-left">{formatTime(timeLeft)}</div>
        <div className="timer-controls">
          <button id="start_stop" onClick={handleStartStop}>
            {isRunning ? '❚❚' : '▶'}
          </button>
          <button id="reset" onClick={handleReset}>↻</button>
        </div>
      </div>
      <audio 
        id="beep" 
        ref={audioRef} 
        src="https://www.soundjay.com/button/beep-07.wav"
      />
      <div className="footer">
        Designed and coded by Tio Mahlendra
      </div>
    </div>
  );
}

export default App;