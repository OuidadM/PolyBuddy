import React from "react";
import { Box, CircularProgress } from "@mui/material";

import "./AvatarPlaceholder.css";

const AvatarPlaceholder = ({ size = 50 }) => (
  <Box
    className="avatar-placeholder"
    style={{ width: size, height: size }}
  >
    <CircularProgress
      size={size * 0.5}
      thickness={5}
      className="avatar-placeholder-loader"
    />
  </Box>
);

export default AvatarPlaceholder;
