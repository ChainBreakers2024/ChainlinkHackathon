// CoinFlip.js
import { useState } from 'react';
import { Card } from '../ui/card';
import styles from './coin.module.css'; // Import the CSS module

const CoinFlip = () => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleCoinClick = () => {
    setIsFlipped(true);

    // Simulating the coin flip result (0 for heads, 1 for tails)
    const flipResult = 1
    setTimeout(() => {
      if (flipResult <= 0.5) {
        console.log('It is heads');
      } else {
        console.log('It is tails');
      }
    }, 1000); // Adjust the delay time as needed

    // Reset the flip after a delay (for demonstration)
    setTimeout(() => {
      setIsFlipped(false);
    }, 5000); // Reset the flip after 3 seconds (adjust as needed)
  };

  return (
    <Card>    
      <div className={styles.container}>
      <div
        id="coin"
        className={`${styles.coin} ${isFlipped ? styles[flipAnimation()] : ''}`}
        onClick={handleCoinClick}
      >
        <div className={`${styles.side} ${styles.sideA}`}></div>
        <div className={`${styles.side} ${styles.sideB}`}></div>
      </div>
    </div>
  </Card>

  );
}

// Function to randomly choose flip animation
const flipAnimation = () => {
  return Math.random() <= 0.5 ? 'heads' : 'tails';
};

export default CoinFlip;
