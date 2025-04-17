"use client"
import { useState } from 'react';
import { io } from 'socket.io-client';

export default function CreateBet() {
  const [amount, setAmount] = useState(10); // Default bet

  const createBet = () => {
    const socket = io('http://localhost:5000');
    socket.emit('createBet', { 
      amount, 
      creatorId: window.Telegram.WebApp.initDataUnsafe.user.id 
    });
    alert('Bet created! Waiting for opponent...');
  };

  return (
    <div>
      <h1>Create a Bet</h1>
      <input 
        type="number" 
        value={amount} 
        onChange={(e) => setAmount(e.target.value)} 
      />
      <button onClick={createBet}>Create Game</button>
    </div>
  );
}