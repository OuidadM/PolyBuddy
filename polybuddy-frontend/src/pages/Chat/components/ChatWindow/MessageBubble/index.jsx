import React from "react";
import { Box, Stack, Typography } from "@mui/material";

import "./MessageBubble.css";

const MessageBubble = ({ message }) => {
  const statusClass = message.sent ? "sent" : "received";

  return (
    <Stack
      direction="row"
      className={`message-bubble-container ${statusClass}`}
    >
      <Stack className={`message-bubble-inner ${statusClass}`}>
        <Box className={`message-bubble ${statusClass}`}>
          <Typography variant="h6" className="message-bubble-text">
            {message.text}
          </Typography>
        </Box>

        <Stack direction="row" className="message-meta">
          <Typography variant="body2" className="message-time">
            {message.time}
          </Typography>
          <Box className={`message-status-dot ${statusClass}`} />
        </Stack>
      </Stack>
    </Stack>
  );
};

export default MessageBubble;
