
import React from "react";
import { Avatar, Box, IconButton, Paper, Stack, CircularProgress } from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import ChatIcon from "@mui/icons-material/Chat";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import "./Sidebar.css";

const AvatarPlaceholder = ({ size = 78 }) => (
  <Box className="avatar-placeholder" style={{ width: size, height: size }}>
    <CircularProgress size={size * 0.5} thickness={5} sx={{ color: 'grey.500' }} />
  </Box>
);

const Sidebar = ({ isLoading, getAvatarUrl }) => (
  <Paper elevation={0} className="sidebar-root">
    {/* User's own Avatar */}
    {isLoading ? (
      <AvatarPlaceholder size={78} />
    ) : (
      <Avatar
        src={getAvatarUrl('ellipse1')}
        className="sidebar-avatar"
      />
    )}
    <Stack className="sidebar-stack">
      <IconButton className="sidebar-icon">
        <HomeIcon sx={{ fontSize: 40 }} />
      </IconButton>
      <Box className="sidebar-icon-primary">
        <IconButton className="sidebar-icon sidebar-icon-selected">
          <ChatIcon sx={{ fontSize: 40 }} />
        </IconButton>
      </Box>
      <IconButton className="sidebar-icon">
        <NotificationsIcon sx={{ fontSize: 40 }} />
      </IconButton>
      <IconButton className="sidebar-icon">
        <SettingsIcon sx={{ fontSize: 40 }} />
      </IconButton>
    </Stack>
    <IconButton className="sidebar-logout">
      <LogoutIcon sx={{ fontSize: 40 }} />
    </IconButton>
  </Paper>
);

export default Sidebar;
