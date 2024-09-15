import React, { useContext, useEffect, useState } from 'react';
import './main.css';
import { assets } from '../../assets/assets';
import { Context } from '../../contex/contex';

const Main = () => {
  const { onSent, recentPrompt, showResult, loading, resultData, setInput, input } = useContext(Context);

  // State to manage window loading animation
  const [isLoading, setIsLoading] = useState(true);

  // State to manage the user's online status and reconnection attempts
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isReconnecting, setIsReconnecting] = useState(!navigator.onLine);
  const [selectedImage, setSelectedImage] = useState(null); // State to store the selected image
  const [isListening, setIsListening] = useState(false); // State to track if the mic is listening

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = SpeechRecognition ? new SpeechRecognition() : null;

  // Function to handle key down events
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && input) {
      onSent();  // Execute onSent when Enter is pressed
    }
  };

  // Function to handle image selection from the gallery
  const handleImageSelection = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));  // Store the selected image URL
    }
  };

  // Start/stop voice recognition
  const handleMicClick = () => {
    if (!recognition) {
      alert('Speech recognition not supported in this browser.');
      return;
    }

    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      recognition.start();
      setIsListening(true);
    }
  };

  if (recognition) {
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);  // Set recognized speech to input
    };

    recognition.onend = () => {
      setIsListening(false);  // Automatically stop listening once speech ends
    };
  }

  // Effect to track user's connection status and handle reconnection logic
  useEffect(() => {
    const handleOnlineStatus = () => {
      setIsOnline(navigator.onLine);
      setIsReconnecting(!navigator.onLine);
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOnlineStatus);

    const checkConnection = setInterval(() => {
      if (!navigator.onLine) {
        setIsReconnecting(true);
      }
    }, 3000);  // Check connection status every 3 seconds

    // Clean up the event listeners and interval on component unmount
    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOnlineStatus);
      clearInterval(checkConnection);
    };
  }, []);

  // Effect to remove the loading animation after the page loads
  useEffect(() => {
    // Simulate window loading
    setTimeout(() => {
      setIsLoading(false);  // Remove the loading screen after 2 seconds (simulate loading time)
    }, 2000);
  }, []);

  return (
    <>
      {/* Full-screen loader that disappears after the page has loaded */}
      {isLoading && (
        <div className="window-loader">
          <div className="spinner"></div>
        </div>
      )}

      <div className='main'>
        <div className="nav">
          <p>Gemini</p>
          <img src={assets.user_icon} alt="User" />
        </div>
        <div className="main-container">
          {!showResult ? (
            <>
              <div className="greet">
                <p><span>Hello, Dev</span></p>
                <p>How can I help you Today</p>
              </div>
              <div className="cards">
                <div className="card">
                  <p>Suggests beautiful places to see on an upcoming road trip</p>
                  <img src={assets.compass_icon} alt="Compass" />
                </div>
                <div className="card">
                  <p>Detail the React.js</p>
                  <img src={assets.bulb_icon} alt="Bulb" />
                </div>
                <div className="card">
                  <p>Give the New update on the R.G.Kar Rap Case</p>
                  <img src={assets.message_icon} alt="Message" />
                </div>
                <div className="card">
                  <p>What the best language among all</p>
                  <img src={assets.code_icon} alt="Code" />
                </div>
              </div>
            </>
          ) : (
            <div className='result'>
              <div className="result-title">
                <img src={assets.user_icon} alt="User" />
                <p>{recentPrompt}</p>
              </div>
              <div className="result-data">
                <img src={assets.gemini_icon} alt="Gemini" />
                {loading ? (
                  <div className='loader'>
                    <hr />
                    <hr />
                    <hr />
                  </div>
                ) : (
                  <p dangerouslySetInnerHTML={{ __html: resultData }} />
                )}
              </div>
            </div>
          )}

          <div className="main-bottom">
            <div className="search-box">
              <input
                onChange={(e) => setInput(e.target.value)}
                value={input}
                type="text"
                placeholder='Enter Prompt here'
                onKeyDown={handleKeyDown}  // Add onKeyDown event listener
              />
              <div>
                {/* Gallery icon triggers file input */}
                <label htmlFor="gallery-input">
                  <img src={assets.gallery_icon} alt="Gallery" />
                </label>
                <input
                  id="gallery-input"
                  type="file"
                  accept="image/*"
                  style={{ display: 'none' }}  // Hide the file input
                  onChange={handleImageSelection}
                />
                <img
                  src={assets.mic_icon}
                  alt="Microphone"
                  onClick={handleMicClick}  // Add microphone click event
                  className={isListening ? 'listening' : ''}  // Highlight if listening
                />
                {input ? <img onClick={() => onSent()} src={assets.send_icon} alt="Send" /> : null}
              </div>
            </div>
            <p className="bottom-info">
              Gemini may display inaccurate info about people.
            </p>
          </div>
        </div>

        {/* Show the selected image if any */}
        {selectedImage && (
          <div className="selected-image">
            <p>Selected Image:</p>
            <img src={selectedImage} alt="Selected" />
          </div>
        )}

        {/* Showing the popup window in the screen */}
        {!isOnline && (
          <div className='popup'>
            <div className="popup-content">
              <p>You are not connected</p>
              {isReconnecting && (
                <div className="reconnecting">
                  <p>Reconnecting...</p>
                  <div className="loader1">
                    <hr />
                    <hr />
                    <hr />
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Main;
