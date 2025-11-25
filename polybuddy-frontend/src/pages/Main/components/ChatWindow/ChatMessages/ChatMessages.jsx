import React from "react";
import { Box } from "@mui/material";
import MessageBubble from "../MessageBubble/MessageBubble";

import "./ChatMessages.css";

const ChatMessages = ({ messages }) => (
  <Box className="chat-messages">
    {messages.map((message) => (
      <MessageBubble key={message.id} message={message} />
    ))}
  </Box>
);

export default ChatMessages;
