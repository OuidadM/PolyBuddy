import React, { useState, useEffect } from "react";
import { Avatar, Box, IconButton, Paper, Stack, CircularProgress, Badge } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../auth/AuthContext";
import invitationService from "../../../services/invitation.service";
import conversationService from "../../../services/conversation.service";

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
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading: authLoading, logout } = useAuth(); // ✅ Ajout de logout
  const [notificationCount, setNotificationCount] = useState(0);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);

  useEffect(() => {
    console.log("USER depuis useAuth :", user);
  }, [user]);

  getAvatarUrl = (avatarUrl) => {
    if (!avatarUrl) {
      return "/default-avatar.png";
    }
    return avatarUrl;
  };

  useEffect(() => {
    loadNotificationCount();
    loadUnreadMessagesCount();
    // Rafraîchir toutes les 30 secondes
    const interval = setInterval(() => {
      loadNotificationCount();
      loadUnreadMessagesCount();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadNotificationCount = async () => {
    try {
      const response = await invitationService.getReceivedInvitations();
      setNotificationCount(response.data?.length || 0);
    } catch (error) {
      console.error("Erreur chargement notifications:", error);
    }
  };

  const loadUnreadMessagesCount = async () => {
    try {
      const response = await conversationService.getUnreadCount();
      setUnreadMessagesCount(response.data?.unreadCount || 0);
    } catch (error) {
      console.error("Erreur chargement messages non lus:", error);
    }
  };

  const isActive = (path) => location.pathname === path;
  
  const handleNotificationClick = () => {
    navigate('/notifications');
    loadNotificationCount();
  };

  const handleChatClick = () => {
    navigate('/chat');
    loadUnreadMessagesCount();
  };

  const handleLogout = async () => {
    try {
      await logout();
      console.log("✅ Déconnexion réussie");
    } catch (error) {
      console.error("❌ Erreur lors de la déconnexion:", error);
    }
  };

  return (
    <Paper elevation={0} className="sidebar-root">
      {isLoading || authLoading ? (
        <AvatarPlaceholder size={78} />
      ) : (
        <Avatar
          src={getAvatarUrl(user?.avatar_url)}
          alt={`${user?.prenom} ${user?.nom}`}
          className="sidebar-avatar"
          onClick={() => navigate("/profile")}
          sx={{ cursor: "pointer" }}
        />
      )}

      <Stack className="sidebar-stack">
        
        {/* HOME */}
        <Box className={isActive('/home') ? "sidebar-icon-primary" : ""}>
          <IconButton 
            onClick={() => navigate('/home')} 
            className={`sidebar-icon ${isActive('/home') ? 'sidebar-icon-selected' : ''}`}
          >
            <HomeIcon sx={{ fontSize: 40 }} />
          </IconButton>
        </Box>

        {/* CHAT */}
        <Box className={isActive('/chat') ? "sidebar-icon-primary" : ""}>
          <IconButton 
            onClick={handleChatClick}
            className={`sidebar-icon ${isActive('/chat') ? 'sidebar-icon-selected' : ''}`}
          >
            <Badge 
              badgeContent={unreadMessagesCount} 
              color="error"
              max={99}
            >
              <ChatIcon sx={{ fontSize: 40 }} />
            </Badge>
          </IconButton>
        </Box>

        {/* NOTIFICATIONS */}
        <Box className={isActive('/notifications') ? "sidebar-icon-primary" : ""}>
          <IconButton 
            className={`sidebar-icon ${isActive('/notifications') ? 'sidebar-icon-selected' : ''}`}
            onClick={handleNotificationClick}
          >
            <Badge 
              badgeContent={notificationCount} 
              color="error"
              max={99}
            >
              <NotificationsIcon sx={{ fontSize: 40 }} />
            </Badge>
          </IconButton>
        </Box>

        {/* SETTINGS */}
        <Box className={isActive('/profile') ? "sidebar-icon-primary" : ""}>
          <IconButton
            className={`sidebar-icon ${isActive('/profile') ? 'sidebar-icon-selected' : ''}`}
            onClick={() => navigate('/profile')}
          >
            <SettingsIcon sx={{ fontSize: 40 }} />
          </IconButton>
        </Box>

      </Stack>

      <IconButton 
        className="sidebar-logout" 
        onClick={handleLogout}
      >
        <LogoutIcon sx={{ fontSize: 40 }} />
      </IconButton>

    </Paper>
  );
};

export default Sidebar;