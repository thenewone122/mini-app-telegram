"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import socket from "@/lib/socket";
import { MessageCircle } from "lucide-react";

const ChatComponent = ({ betId, user }) => {
  const [chatMessages, setChatMessages] = useState([]);
  const chatInputRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Socket listeners for chat
    socket.on("receive-message", (newMessage) => {
      setChatMessages((prev) => [...prev, newMessage]);
    });

    socket.on("system-message", (systemMsg) => {
      setChatMessages((prev) => [
        ...prev,
        {
          sender: "system",
          text: systemMsg,
          time: new Date().toLocaleTimeString(),
        },
      ]);
    });

    return () => {
      socket.off("receive-message");
      socket.off("system-message");
    };
  }, []);

  const handleSendMessage = () => {
    const messageText = chatInputRef.current?.value.trim();
    if (!messageText || !user) return;

    const newMessage = {
      sender: "user",
      userId: user.userId,
      text: messageText,
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    // Emit message to backend
    socket.emit("send-message", {
      betId,
      message: newMessage,
    });

    chatInputRef.current.value = "";
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [chatMessages]);

  return (
    <Card className="bg-card border-border h-[calc(100vh-200px)] max-h-[600px]">
      <CardContent className="p-0 flex flex-col h-full">
        <div className="p-3 border-b border-border flex items-center">
          <MessageCircle className="w-4 h-4 mr-2 text-muted-foreground" />
          <h3 className="text-sm font-medium">Chat</h3>
        </div>
        
        <div className="flex-1 overflow-y-auto p-3 space-y-3 scrollbar-thin scrollbar-thumb-rounded-md scrollbar-thumb-primary/20 
          scrollbar-track-transparent hover:scrollbar-thumb-primary/30">
          {chatMessages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <div className="bg-secondary/50 p-4 rounded-full mb-3">
                <MessageCircle className="w-6 h-6 text-muted-foreground" />
              </div>
              <h3 className="text-base font-medium mb-1">No messages yet</h3>
              <p className="text-sm text-muted-foreground max-w-[250px]">
                Be the first to start a conversation. Type a message below to get started.
              </p>
            </div>
          ) : (
            chatMessages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.userId === user?.userId ? "justify-end" : ""
                }`}
              >
                {msg.sender === "system" && (
                  <div className="text-xs text-center w-full text-muted-foreground py-1 bg-secondary/30 rounded-md px-2">
                    {msg.text}
                  </div>
                )}

                {msg.sender !== "system" && (
                  <div
                    className={`max-w-[80%] ${
                      msg.userId === user?.userId
                        ? "bg-primary/20 text-primary-foreground/90"
                        : "bg-secondary text-secondary-foreground"
                    } rounded-lg p-3 shadow-sm`}
                  >
                    <div className="text-sm whitespace-pre-wrap break-words">{msg.text}</div>
                    <div className="text-xs text-muted-foreground text-right mt-1">
                      {msg.time}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
        
        <div className="p-3 border-t border-border flex gap-2">
          <input
            ref={chatInputRef}
            type="text"
            placeholder="Type a message..."
            className="flex-1 px-3 py-2 text-sm border border-border rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors"
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          />
          <Button
            size="sm"
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
            onClick={handleSendMessage}
          >
            Send
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ChatComponent;
