import React from "react";
import { Avatar, Box, IconButton, Paper, Stack, CircularProgress } from "@mui/material";
// Import hooks for navigation
import { useNavigate, useLocation } from "react-router-dom"; 

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

const Sidebar = ({ isLoading, getAvatarUrl }) => {
  // 1. Initialize Hooks
  const navigate = useNavigate();
  const location = useLocation();

  // 2. Helper function to check if a path is active
  const isActive = (path) => location.pathname === path;

  return (
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
        
        {/* --- HOME BUTTON --- */}
        <Box className={isActive('/home') ? "sidebar-icon-primary" : ""}>
          <IconButton 
            onClick={() => navigate('/home')} 
            className={`sidebar-icon ${isActive('/home') ? 'sidebar-icon-selected' : ''}`}
          >
            <HomeIcon sx={{ fontSize: 40 }} />
          </IconButton>
        </Box>

        {/* --- CHAT BUTTON --- */}
        <Box className={isActive('/chat') ? "sidebar-icon-primary" : ""}>
          <IconButton 
            onClick={() => navigate('/chat')}
            className={`sidebar-icon ${isActive('/chat') ? 'sidebar-icon-selected' : ''}`}
          >
            <ChatIcon sx={{ fontSize: 40 }} />
          </IconButton>
        </Box>

        {/* --- NOTIFICATIONS (No route yet) --- */}
        <IconButton className="sidebar-icon">
          <NotificationsIcon sx={{ fontSize: 40 }} />
        </IconButton>

        {/* --- SETTINGS (No route yet) --- */}
        <IconButton className="sidebar-icon">
          <SettingsIcon sx={{ fontSize: 40 }} />
        </IconButton>

      </Stack>

      {/* --- LOGOUT BUTTON --- */}
      <IconButton 
        className="sidebar-logout" 
        onClick={() => navigate('/')} 
      >
        <LogoutIcon sx={{ fontSize: 40 }} />
      </IconButton>

    </Paper>
  );
};

export default Sidebar;