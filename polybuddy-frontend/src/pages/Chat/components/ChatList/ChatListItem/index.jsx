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
  ListItemButton,
} from "@mui/material";
import DoneAllIcon from "@mui/icons-material/DoneAll";

import "./ChatListItem.css";

const AvatarPlaceholder = ({ size = 50 }) => (
  <Box
    className="cli-avatar-placeholder"
    sx={{
      width: size,
      height: size,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    }}
  >
    <CircularProgress
      size={size * 0.5}
      thickness={5}
      sx={{ color: "grey.500" }}
    />
  </Box>
);

const ChatListItem = ({ item, isLoading, getAvatarUrl, onClick }) => {
  const avatarSrc =
    item.avatarUrl || (item.avatar ? getAvatarUrl(item.avatar) : null);

  return (
    <ListItem disablePadding className="chat-list-item">
      <ListItemButton onClick={onClick}>
        <ListItemAvatar>
          {isLoading ? (
            <AvatarPlaceholder />
          ) : (
            <Avatar src={avatarSrc} className="cli-avatar">
              {!avatarSrc && item.name
                ? item.name.charAt(0).toUpperCase()
                : "?"}
            </Avatar>
          )}
        </ListItemAvatar>

        <ListItemText
          className="cli-text"
          primary={
            <Typography variant="h7" className="cli-primary">
              {item.name}
              {item.isAlumni && (
                <span
                  style={{
                    marginLeft: "6px",
                    fontSize: "16px",
                    color: "#f5576c",
                  }}
                >
                  ★
                </span>
              )}
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

          {item.hasCheck && <DoneAllIcon className="cli-check" />}

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
      </ListItemButton>
    </ListItem>
  );
};

export default ChatListItem;
