"use client";

import { useEffect, useState, useCallback } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import { useParams } from "next/navigation";
import socket from "@/lib/socket";
import { useUser } from "@/context/context";
import { Loading } from "@/components/loading/loading";
import ChatComponent from "@/components/game/chatMessages";

export default function ChessGame() {
  const { betId } = useParams();
  const { user } = useUser();

  const [game, setGame] = useState(new Chess());
  const [whitePlayerId, setWhitePlayerId] = useState(null);
  const [blackPlayerId, setBlackPlayerId] = useState(null);
  const [whiteTime, setWhiteTime] = useState(0);
  const [blackTime, setBlackTime] = useState(0);
  const [moveHistory, setMoveHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  // Join game and set initial state
  useEffect(() => {
    if (!betId || !user) return;

      socket.emit("join-room", { betId, user }); // Only join after connection
 
    socket.on(
      "game-state",
      ({ fen, white, black, whiteTime, blackTime, moveHistory }) => {
        setGame(new Chess(fen));
        setWhitePlayerId(white);
        setBlackPlayerId(black);
        setWhiteTime(whiteTime);
        setBlackTime(blackTime);
        setMoveHistory(moveHistory || []);
        setLoading(false);
      }
    );

    // On move made
    socket.on("game-update", ({ fen, moveHistory }) => {
      setGame(new Chess(fen));
      setMoveHistory(moveHistory || []);
    });

    socket.on("time-update", ({ whiteTime, blackTime }) => {
      setWhiteTime(whiteTime);
      setBlackTime(blackTime);
    });

    socket.on("invalid-move", (message) => {
      alert("Invalid move: " + message);
    });

    socket.on("game-end", ({ winner }) => {
      alert(`Game over. Winner: ${winner}`);
    });

    return () => {
      socket.off('connect')
      socket.off("game-state");
      socket.off("game-update");
      socket.off("invalid-move");
      socket.off("game-end");
      socket.off("time-update");
    };
  }, [betId, user]);

  // Handle piece drop
  const onDrop = useCallback(
    (sourceSquare, targetSquare) => {
      const move = {
        from: sourceSquare,
        to: targetSquare,
        promotion: "q", // auto-queen
      };
  
      const gameCopy = new Chess(game.fen());
      const result = gameCopy.move(move);
  
      if (result) {
        setGame(gameCopy);
        socket.emit("make-move", {
          betId,
          move: result,
          userId: user.userId,
        });
  
        // 🧠 Check for checkmate, draw, etc.
        if (gameCopy.isCheckmate()) {
          socket.emit("game-over", {
            betId,
            winner: user.userId, // current user won
            reason: "checkmate",
          });
          alert("Checkmate! You win.");
        } else if (gameCopy.isStalemate()) {
          socket.emit("game-over", {
            betId,
            winner: null,
            reason: "stalemate",
          });
          alert("Stalemate! It's a draw.");
        } else if (gameCopy.isDraw()) {
          socket.emit("game-over", {
            betId,
            winner: null,
            reason: "draw",
          });
          alert("Draw!");
        } else if (gameCopy.isCheck()) {
          alert("Check!");
        }
  
        return true;
      }
  
      return false;
    },
    [game, betId,user.userId]
  );
  
  // Determine if it's the player's turn
  const isPlayerTurn = (() => {
    if (!user || !whitePlayerId || !blackPlayerId) return false;
    const isWhite = Number(user.userId) === whitePlayerId;
    const isBlack = Number(user.userId) === blackPlayerId;

    const turn = game.turn();
    return (turn === "w" && isWhite) || (turn === "b" && isBlack);
  })();

  // Determine board orientation
  const boardOrientation =
    Number(user?.userId) === blackPlayerId ? "black" : "white";

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };
  if (loading) {
    return (
      <>
        <Loading type="spinner" fullScreen={true}/>
      </>
    );
  }
  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div style={{ marginBottom: "1rem" }}>
        <p>
          <strong>White Time:</strong> {formatTime(whiteTime)}
        </p>
        <p>
          <strong>Black Time:</strong> {formatTime(blackTime)}
        </p>
      </div>

      <Chessboard
        position={game.fen()}
        onPieceDrop={onDrop}
        boardOrientation={boardOrientation}
        arePiecesDraggable={isPlayerTurn}
      />

      <div style={{ marginTop: "1rem" }}>
        <h3>Move History</h3>
        <ol>
          {moveHistory.map((move, i) => (
            <li key={i}>{move.san || `${move.from}-${move.to}`}</li>
          ))}
        </ol>
      </div>
      <ChatComponent betId={betId} user={user}/>
    </div>
  );
}
