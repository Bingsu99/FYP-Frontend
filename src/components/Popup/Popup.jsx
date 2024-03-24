import React, { useState, useEffect } from 'react';
import './Popup.css';

function Popup({ message, className }) {
  const [isVisible, setIsVisible] = useState(false);
  const [animationClass, setAnimationClass] = useState('');

  useEffect(() => {
    if (message) {
      setIsVisible(true);
      setAnimationClass('slide-in');

      const timer = setTimeout(() => {
        setAnimationClass('slide-out');

        const hideTimer = setTimeout(() => {
          setIsVisible(false);
        }, 500); // CSS animation duration to slide out

        return () => clearTimeout(hideTimer);
      }, 3000); // Duration before sliding out

      return () => clearTimeout(timer);
    }
  }, [message]);

  // Only render the popup if isVisible is true
  return isVisible ? (
    <div className={`${className} ${animationClass} transition-all duration-500`}>
      {message}
    </div>
  ) : null;
}

export default Popup;
