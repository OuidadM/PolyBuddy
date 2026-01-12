import React from "react";
import { Box, IconButton, Stack, TextField } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import SendIcon from "@mui/icons-material/Send";

import "./MessageInput.css";

const MessageInput = ({ value, onChange, onSend }) => {
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <Stack direction="row" className="message-input-container">
      <Box className="message-input-box">
        <IconButton className="input-icon">
          <AttachFileIcon />
        </IconButton>

        <TextField
          fullWidth
          variant="standard"
          placeholder="Tapez votre message..."
          value={value}
          onChange={onChange}
          onKeyPress={handleKeyPress}
          className="message-textfield"
          InputProps={{
            disableUnderline: true,
          }}
        />

        <IconButton className="emoji-icon">
          <EmojiEmotionsIcon />
        </IconButton>

        <IconButton className="camera-icon">
          <CameraAltIcon />
        </IconButton>
      </Box>

      <IconButton 
        className="message-send-btn"
        onClick={onSend}
        disabled={!value.trim()}
      >
        <SendIcon />
      </IconButton>
    </Stack>
  );
};

export default MessageInput;