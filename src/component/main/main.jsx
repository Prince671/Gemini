import React, { useContext, useEffect, useState } from 'react';
import './main.css';
import { assets } from '../../assets/assets';
import { Context } from '../../contex/contex';

const Main = () => {
  const { onSent, recentPrompt, showResult, loading, resultData, setInput, input } = useContext(Context);
  
  // State to manage the user's online status and reconnection attempts
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isReconnecting, setIsReconnecting] = useState(!navigator.onLine);

  // Function to handle key down events
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (input) {
        onSent();  // Execute onSent when Enter is pressed
      }
    }
  };
  
  // Effect to track user's connection status and handle reconnection logic
  useEffect(() => {
    const handleOnlineStatus = () => {
      if (navigator.onLine) {
        setIsOnline(true);
        setIsReconnecting(false);  // Stop showing "Reconnecting..." once online
      } else {
        setIsOnline(false);
        setIsReconnecting(true);   // Start showing "Reconnecting..." when offline
      }
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

  return (
    <div className='main'>
      <div className="nav">
        <p>Gemini</p>
        <img src={assets.user_icon} alt="" />
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
                <img src={assets.compass_icon} alt="" />
              </div>
              <div className="card">
                <p>Detail the React.js</p>
                <img src={assets.bulb_icon} alt="" />
              </div>
              <div className="card">
                <p>Give the New update on the R.G.Kar Rap Case</p>
                <img src={assets.message_icon} alt="" />
              </div>
              <div className="card">
                <p>What the best language among all</p>
                <img src={assets.code_icon} alt="" />
              </div>
            </div>
          </>
        ) : (
          <div className='result'>
            <div className="result-title">
              <img src={assets.user_icon} alt="" />
              <p>{recentPrompt}</p>
            </div>
            <div className="result-data">
              <img src={assets.gemini_icon} alt="" />
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
              <img src={assets.gallery_icon} alt="" />
              <img src={assets.mic_icon} alt="" />
              {input ? <img onClick={() => onSent()} src={assets.send_icon} alt="" /> : null}
            </div>
          </div>
          <p className="bottom-info">
            Gemini may display inaccurate info about people.
          </p>
        </div>
      </div>

      {/* Showing the popup window in the screen*/}
      {!isOnline && (
        <div className='popup'>
          <div className="popup-content">
            <p>You are not connected</p>
            {isReconnecting && (
              <div className="reconnecting">
                <p>Reconnecting...</p>
                <div className="loader">
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
  );
};

export default Main;
