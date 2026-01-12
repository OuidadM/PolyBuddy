import React, { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import MessageBubble from "../MessageBubble";

import "./ChatMessages.css";

const ChatMessages = ({ messages, currentUserId }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <Box className="chat-messages">
      {messages.map((message) => (
        <MessageBubble 
          key={message.id} 
          message={{
            ...message,
            time: formatTime(message.time)
          }} 
        />
      ))}
      <div ref={messagesEndRef} />
    </Box>
  );
};

export default ChatMessages;