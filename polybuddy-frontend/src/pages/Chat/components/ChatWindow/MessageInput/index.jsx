import React from "react";
import { Box, IconButton, Stack, TextField } from "@mui/material";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import MicIcon from "@mui/icons-material/Mic";

import "./MessageInput.css";

const MessageInput = ({ value, onChange }) => (
  <Stack direction="row" className="message-input-container">
    <Box className="message-input-box">
      <IconButton className="input-icon">
        <AttachFileIcon />
      </IconButton>

      <TextField
        fullWidth
        variant="standard"
        placeholder="Type your message here..."
        value={value}
        onChange={onChange}
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

    <IconButton className="message-mic-btn">
      <MicIcon />
    </IconButton>
  </Stack>
);

export default MessageInput;
