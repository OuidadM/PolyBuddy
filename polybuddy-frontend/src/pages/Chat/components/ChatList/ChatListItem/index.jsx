import React from "react";
import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Stack,
  Box,
  Typography,
  CircularProgress,
} from "@mui/material";
import DoneAllIcon from "@mui/icons-material/DoneAll";

import "./ChatListItem.css";

const AvatarPlaceholder = ({ size = 50 }) => (
  <Box
    className="cli-avatar-placeholder"
    style={{ width: size, height: size }}
  >
    <CircularProgress
      size={size * 0.5}
      thickness={5}
      sx={{ color: "grey.500" }}
    />
  </Box>
);

const ChatListItem = ({ item, isLoading, getAvatarUrl, onClick }) => (
  <ListItem button onClick={onClick} className="chat-list-item">
    <ListItemAvatar>
      {isLoading ? (
        <AvatarPlaceholder />
      ) : (
        <Avatar
          src={getAvatarUrl(item.avatar)}
          className="cli-avatar"
        />
      )}
    </ListItemAvatar>

    <ListItemText
      className="cli-text"
      primary={
        <Typography variant="h7" className="cli-primary">
          {item.name}
        </Typography>
      }
      secondary={
        <Typography variant="body2" className="cli-secondary">
          {item.message}
        </Typography>
      }
    />

    <Stack className="cli-right">
      <Typography className="cli-time">{item.time}</Typography>

      {item.hasCheck && (
        <DoneAllIcon className="cli-check" />
      )}

      {item.badge && (
        <Box
          className={`cli-badge ${
            item.badge === 5 ? "primary" : "alert"
          }`}
        >
          {item.badge}
        </Box>
      )}
    </Stack>
  </ListItem>
);

export default ChatListItem;
