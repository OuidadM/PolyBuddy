import React from "react";
import { Outlet } from "react-router-dom"; 
import Box from "@mui/material/Box";
import Sidebar from "../Sidebar"; // Make sure path to Sidebar is correct
import { useAvatarGenerator } from "../../../hooks/useAvatarGenerator"; 
import { avatarPrompts } from "../../data/avatarPrompts";
import "./MainLayout.css"; // We will create this CSS next

const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict";
const API_KEY = ""; // Your API Key here

const MainLayout = () => {
  // We keep the avatar logic here so it doesn't reload when switching tabs
  const { getAvatarUrl, isLoading } = useAvatarGenerator(
    avatarPrompts,
    API_URL,
    API_KEY
  );

  return (
    <Box className="app-container">
      {/* Sidebar stays permanent */}
      <Sidebar isLoading={isLoading} getAvatarUrl={getAvatarUrl} />

      {/* Outlet is where Feed or Chat will appear */}
      <Box className="content-area">
        <Outlet context={{ getAvatarUrl, isLoading }} /> 
      </Box>
    </Box>
  );
};

export default MainLayout;