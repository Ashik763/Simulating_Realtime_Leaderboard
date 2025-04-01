import { useState, useEffect } from 'react';

export function useAnimatedSentences(sentences: string[], interval: number = 3000) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % sentences.length);
        setIsAnimating(false);
      }, 500); // Half a second for the animation
    }, interval);

    return () => clearInterval(timer);
  }, [sentences, interval]);

  return { currentSentence: sentences[currentIndex], isAnimating };
}

