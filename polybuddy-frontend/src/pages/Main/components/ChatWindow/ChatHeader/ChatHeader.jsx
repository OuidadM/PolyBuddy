import React from "react";
import { Avatar, Box, IconButton, Stack, Typography } from "@mui/material";
import PhoneIcon from "@mui/icons-material/Phone";
import VideocamIcon from "@mui/icons-material/Videocam";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AvatarPlaceholder from "../../ChatList/AvatarPlaceholder/AvatarPlaceholder";

import "./ChatHeader.css";

const ChatHeader = ({ isLoading, getAvatarUrl }) => (
  <Stack direction="row" className="chat-header">
    {isLoading ? (
      <AvatarPlaceholder size={75} />
    ) : (
      <Avatar
        src={getAvatarUrl("ellipse11")}
        className="chat-header-avatar"
      />
    )}

    <Box className="chat-header-info">
      <Typography variant="h5" className="chat-header-name">
        Anil
      </Typography>
      <Typography variant="subtitle2" className="chat-header-status">
        Online - Last seen, 2.02pm
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

export default ChatHeader;
