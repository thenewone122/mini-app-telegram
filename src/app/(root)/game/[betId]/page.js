"use client"
import { useEffect, useState } from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';
import { io } from 'socket.io-client';
import { useParams } from 'next/navigation';

export default function ChessGame() {
    const {betId}=useParams();
    console.log(betId);
  const [game, setGame] = useState(new Chess());
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    // Connect to Socket.io server
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    // Join the game room
    newSocket.emit('joinGame', betId);

    // Listen for opponent's moves
    newSocket.on('gameUpdate', (move) => {
      setGame((prev) => {
        const newGame = new Chess(prev.fen());
        newGame.move(move);
        return newGame;
      });
    });
    
    return () => newSocket.disconnect();
  }, [betId]);

  // Handle piece drops (player moves)
  const onDrop = (sourceSquare, targetSquare) => {
    const move = {
      from: sourceSquare,
      to: targetSquare,
      promotion: 'q', // Auto-queen for simplicity
    };

    try {
      const gameCopy = new Chess(game.fen());
      const result = gameCopy.move(move);
      setGame(gameCopy);
      socket.emit('moveMade', { betId, move: result });
      return true;
    } catch (error) {
      return false; // Invalid move
    }
  };

  return (
    <div>
      <Chessboard position={game.fen()} onPieceDrop={onDrop} />
    </div>
  );
}