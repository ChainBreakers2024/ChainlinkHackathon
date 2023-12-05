"use client";
import React, { useEffect, useRef, useState } from "react";
import { Card } from "@/components/ui/card"
import { initSocket } from "@/lib/socketio";

// Import necessary dependencies

const Roulette = () => {
  const wrapRef = useRef(null);

  useEffect(() => {
    function rand(min, max) {
      return Math.floor(Math.random() * (max - min)) + min;
    }

    const pallete = [
      'r18', 'b8', 'r19', 'g2', 'r20', 'r21', 'b9', 'r10',
      'g3', 'r11', 'b4', 'r12', 'b5', 'r13', 'b6',
      'r14', 'g0', 'r15', 'b7', 'r16', 'g1', 'r17'
    ];

    const bets = {
      'green': [2, 3, 0, 1],
      'red': [18, 19, 20, 21, 10, 11, 12, 13, 14, 15, 16, 17],
      'black': [8, 9, 4, 5, 6, 7]
    };

    const width = 80;
    const wrap = wrapRef.current;

    function spinPromise(color, number) {
      return new Promise((resolve, reject) => {
        if (
          (color === 'green' || color === 'g') && (number >= 0 && number <= 3) ||
          (color === 'black' || color === 'b') && (number >= 4 && number <= 9) ||
          (color === 'red' || color === 'r') && (number >= 10 && number <= 21)
        ) {
          let index, pixels, circles, pixelsStart;

          color = color[0];
          index = pallete.indexOf(color + '' + number);
          pixels = width * (index + 1);
          circles = 1760 * 15; // 15 circles

          pixels -= 80;
          pixels = rand(pixels + 2, pixels + 79);
          pixelsStart = pixels;
          pixels += circles;
          pixels *= -1;

          wrap.style.backgroundPosition = ((pixels + (wrap.offsetWidth / 2)) + '') + 'px';

          setTimeout(() => {
            wrap.style.transition = 'none';
            let pos = (((pixels * -1) - circles) * -1) + (wrap.offsetWidth / 2);
            wrap.style.backgroundPosition = String(pos) + 'px';
            setTimeout(() => {
              wrap.style.transition = 'background-position 5s';
              resolve();
            }, 510);
          }, 5000 + 700);
        }
      });
    }

    function play() {
      let color;
      let r = rand(1, 1000);
      
      if (1 <= r && r < 30) color = 'green';
      else if (30 <= r && r < 530) color = 'red';
      else if (530 <= r && r < 1000) color = 'black';
      
      let bet = bets[color][rand(0, bets[color].length)];
    
      if (color === 'red' && bet === 6) {
        console.log('[Ended at Red 6]');
        let colorBeted = document.createElement('div');
        colorBeted.setAttribute('class', 'color-beted ' + color[0]);
        colorBeted.innerHTML = bet;
        document.body.appendChild(colorBeted);
      } else {
        spinPromise(color, bet).then(() => {
          console.log('[Ended]');
          let colorBeted = document.createElement('div');
          colorBeted.setAttribute('class', 'color-beted ' + color[0]);
          colorBeted.innerHTML = bet;
          document.body.appendChild(colorBeted);
    
          setTimeout(function () {
            console.log('[Start game]');
            play();
          }, 2500);
        });
      }
    }

    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <div className="roulette">
      <div className="roulette-container">
        <div className="wrap" ref={wrapRef}>
          <div className="controller"></div>
        </div>
      </div>
    </div>
  );
};

export default Roulette;
