import React from "react";
import { Avatar, Box, IconButton, Stack, Typography } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import VideocamIcon from "@mui/icons-material/Videocam";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AvatarPlaceholder from "../../ChatList/AvatarPlaceholder";

import "./ChatHeader.css";

const ChatHeader = ({ isLoading, getAvatarUrl, friend }) => {
  if (!friend) return null;

  return (
    <Stack direction="row" className="chat-header">
      {isLoading ? (
        <AvatarPlaceholder size={75} />
      ) : (
        <Avatar
          src={friend.avatar || getAvatarUrl("default")}
          className="chat-header-avatar"
        />
      )}

      <Box className="chat-header-info">
        <Typography variant="h5" className="chat-header-name">
          {friend.name}
          {friend.isAlumni && (
            <span style={{ 
              marginLeft: '8px', 
              fontSize: '20px',
              color: '#f5576c'
            }}>
              ★
            </span>
          )}
        </Typography>
        <Typography variant="subtitle2" className="chat-header-status">
          {friend.specialite || "Étudiant"}
          {friend.entreprise && ` • ${friend.entreprise}`}
        </Typography>
      </Box>

      <IconButton className="chat-header-icon">
        <PhoneIcon />
      </IconButton>

      <IconButton className="chat-header-icon video">
        <VideocamIcon />
      </IconButton>

      <IconButton className="chat-header-icon more">
        <MoreVertIcon />
      </IconButton>
    </Stack>
  );
};

export default ChatHeader;