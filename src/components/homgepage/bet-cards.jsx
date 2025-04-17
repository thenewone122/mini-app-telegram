"use client";
import React, { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Clock } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import axiosInstance from "@/lib/axios";
import socket from "@/lib/socket";

const BetCards = () => {
  const [activeBets, setActiveBets] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchBets = async () => {
      try {
        const response = await axiosInstance.get("/bets");
        setActiveBets(response.data);
      } catch (err) {
        console.error("Error fetching active bets:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchBets();
  }, []);

  useEffect(() => {
    if (!socket) return;
    const handleNewBets = (data) => {
        console.log(data)
      setActiveBets((prev) => [...prev, data]);
    };
    socket.on("new-bet", handleNewBets);

    return () => {
      socket.off("new-bet", handleNewBets);
    };
  }, [socket]);

  const handleJoinBet=(betId)=>{

  }


  return (
    <>
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Available Games</h2>
        <div className="stats-counter">
          {loading ? (
            <Skeleton
              width={100}
              height={20}
              baseColor="#2d2d2d"
              highlightColor="#3d3d3d"
            />
          ) : (
            <>
              <span className="number">{activeBets.length}</span> Active Games
            </>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {loading ? (
          [1, 2, 3].map((i) => (
            <Card key={i} className="bg-card border-border">
              <div className="flex items-center p-4">
                <Skeleton
                  circle
                  height={40}
                  width={40}
                  baseColor="#2d2d2d"
                  highlightColor="#3d3d3d"
                />
                <div className="flex-1 ml-4 space-y-2">
                  <Skeleton
                    height={16}
                    width={120}
                    baseColor="#2d2d2d"
                    highlightColor="#3d3d3d"
                  />
                  <div className="flex items-center">
                    <Skeleton
                      height={12}
                      width={80}
                      baseColor="#2d2d2d"
                      highlightColor="#3d3d3d"
                    />
                  </div>
                </div>
                <Skeleton
                  height={32}
                  width={80}
                  baseColor="#2d2d2d"
                  highlightColor="#3d3d3d"
                />
              </div>
            </Card>
          ))
        ) : activeBets.length == 0 ? (
          <div className="text-muted-foreground text-center py-4">
            No active games available
          </div>
        ) : (
          activeBets.map((bet) => {
            const isCurrentUser=true;
           return <Card
              key={bet.id}
              className="game-card overflow-hidden bg-card border-border"
            >
              <div className="flex items-center p-4">
                <Avatar className="h-10 w-10 mr-4 bg-secondary">
                  <AvatarImage
                    src={`/placeholder.svg?height=40&width=40`}
                    alt={bet.creator.username}
                  />
                  <AvatarFallback>
                    {" "}
                    {bet.creator.username.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center">
                    <div className="font-medium">{bet.creator.username}</div>
                    <div className="rating-badge ml-2">{"rating"}</div>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Clock className="w-3 h-3 mr-1" />
                    {secondsToMinutes(bet.timeControl)}
                  </div>
                </div>
                <div className="flex flex-col items-end">
                  <div className="bet-badge mb-1">{bet.amount} birr</div>
                  {isCurrentUser ? (
                  <div className="text-sm text-muted-foreground">Your game</div>
                  ) : (
                  <Button
                    size="sm"
                    className="bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() => handleJoinBet(bet.id)}
                  >
                    Join Game
                  </Button>
                  )}
                </div>
              </div>
            </Card>
})
        )}
      </div>
    </>
  );
};
function secondsToMinutes(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

export default BetCards;







// "use client"
// import React, { useEffect, useState } from "react";
// import { Card } from "../ui/card";
// import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
// import { Button } from "../ui/button";
// import { Clock } from "lucide-react";
// import socket from "@/lib/socket";
// import axiosInstance from "@/lib/axios";
// import Skeleton from "react-loading-skeleton";
// import "react-loading-skeleton/dist/skeleton.css";
// const BetCards = () => {
//   const user = {
//     id: 1,
//   };
//   const [activeBets, setActiveBets] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch initial active bets
//   useEffect(() => {
//     const fetchActiveBets = async () => {
//       try {
//         const response = await axiosInstance.get("/bets");
//         setActiveBets(response.data);
//       } catch (err) {
//         setError("Failed to load active games");
//         console.error("Error fetching active bets:", err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchActiveBets();
//   }, []);

//   // Socket.io real-time updates
//   useEffect(() => {
//     if (!socket) return;

//     const handleNewBet = (newBet) => {
//       setActiveBets((prev) => [...prev, newBet]);
//     };

//     const handleRemoveBet = (betId) => {
//       setActiveBets((prev) => prev.filter((bet) => bet.id !== betId));
//     };

//     socket.on("new-bet", handleNewBet);
//     socket.on("remove-bet", handleRemoveBet);

//     return () => {
//       socket.off("new-bet", handleNewBet);
//       socket.off("remove-bet", handleRemoveBet);
//     };
//   }, [socket]);

//   const handleJoinBet = (betId) => {
//     if (!user) {
//       // Handle user authentication
//       return;
//     }
//     socket.emit("join-bet", {
//       betId,
//       userId: user.id,
//     });
//   };

//   const formatTimeControl = (minutes) => {
//     return `${minutes}+0 min`; // Update if you implement increment
//   };

//   if (error) {
//     return <div className="text-red-500">{error}</div>;
//   }

//   return (
//     <>
//       <div className="flex items-center justify-between mb-4">
//         <h2 className="text-lg font-semibold">Available Games</h2>
//         <div className="stats-counter text-sm text-muted-foreground">
//           {loading ? (
//             <Skeleton
//               width={100}
//               height={20}
//               baseColor="#2d2d2d"
//               highlightColor="#3d3d3d"
//             />
//           ) : (
//             <>
//               <span className="number">{activeBets.length}</span> Active Games
//             </>
//           )}
//         </div>
//       </div>

//       <div className="space-y-3">
//       {loading ? (
//           [1, 2, 3].map((i) => (
//             <Card key={i} className="bg-card border-border">
//               <div className="flex items-center p-4">
//                 <Skeleton
//                   circle
//                   height={40}
//                   width={40}
//                   baseColor="#2d2d2d"
//                   highlightColor="#3d3d3d"
//                 />
//                 <div className="flex-1 ml-4 space-y-2">
//                   <Skeleton
//                     height={16}
//                     width={120}
//                     baseColor="#2d2d2d"
//                     highlightColor="#3d3d3d"
//                   />
//                   <div className="flex items-center">
//                     <Skeleton
//                       height={12}
//                       width={80}
//                       baseColor="#2d2d2d"
//                       highlightColor="#3d3d3d"
//                     />
//                   </div>
//                 </div>
//                 <Skeleton
//                   height={32}
//                   width={80}
//                   baseColor="#2d2d2d"
//                   highlightColor="#3d3d3d"
//                 />
//               </div>
//             </Card>
//           ))
//         ) : activeBets.length === 0 ? (
//           <div className="text-muted-foreground text-center py-4">
//             No active games available
//           </div>
//         ) : (
//           activeBets.map((bet) => {
//             const isCurrentUser = bet.creator.id === user?.id;

//             return (
//               <Card
//                 key={bet.id}
//                 className="game-card overflow-hidden bg-card border-border"
//               >
//                 <div className="flex items-center p-4">
//                   <Avatar className="h-10 w-10 mr-4 bg-secondary">
//                     <AvatarImage
//                       src={bet.creator.avatar}
//                       alt={bet.creator.username}
//                     />
//                     <AvatarFallback>
//                       {bet.creator.username.charAt(0)}
//                     </AvatarFallback>
//                   </Avatar>
//                   <div className="flex-1">
//                     <div className="flex items-center">
//                       <div className="font-medium">{bet.creator.username}</div>
//                       <div className="rating-badge ml-2">
//                         {bet.creator.rating}
//                       </div>
//                     </div>
//                     <div className="flex items-center text-sm text-muted-foreground">
//                       <Clock className="w-3 h-3 mr-1" />
//                       {formatTimeControl(bet.timeControl)}
//                     </div>
//                   </div>
//                   <div className="flex flex-col items-end">
//                     <div className="bet-badge mb-1">${bet.amount}</div>
//                     {isCurrentUser ? (
//                       <div className="text-sm text-muted-foreground">
//                         Your game
//                       </div>
//                     ) : (
//                       <Button
//                         size="sm"
//                         className="bg-primary hover:bg-primary/90 text-primary-foreground"
//                         onClick={() => handleJoinBet(bet.id)}
//                       >
//                         Join Game
//                       </Button>
//                     )}
//                   </div>
//                 </div>
//               </Card>
//             );
//           })
//         )}
//       </div>
//     </>
//   );
// };

// export default BetCards;
