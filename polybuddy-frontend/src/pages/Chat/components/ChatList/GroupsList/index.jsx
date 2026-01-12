import React from "react";
import { List, Typography, Divider, Box, IconButton } from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ChatListItem from "../ChatListItem";

import "./GroupsList.css";

const GroupsList = ({ groups, isLoading, getAvatarUrl, onSelect, canCreateGroup, onCreateGroup }) => (
  <div className="groups-list-container">
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'space-between',
      mb: 1
    }}>
      <Typography variant="h3" className="groups-title">
        Groupes
      </Typography>
      
      {canCreateGroup && (
        <IconButton 
          onClick={onCreateGroup}
          sx={{ 
            color: 'primary.main',
            '&:hover': { 
              backgroundColor: 'rgba(1, 158, 230, 0.1)' 
            }
          }}
        >
          <AddCircleOutlineIcon />
        </IconButton>
      )}
    </Box>

    {groups.length === 0 && !isLoading ? (
      <Box sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
        <Typography variant="body2">
          {canCreateGroup 
            ? "Aucun groupe pour le moment. Créez-en un !" 
            : "Aucun groupe rejoint pour le moment"}
        </Typography>
      </Box>
    ) : (
      <List className="groups-list">
        {groups.map((group, index) => (
          <React.Fragment key={group.id}>
            <ChatListItem
              item={group}
              isLoading={isLoading}
              getAvatarUrl={getAvatarUrl}
              onClick={() => onSelect(group.name)}
            />
            {index < groups.length - 1 && <Divider className="groups-divider" />}
          </React.Fragment>
        ))}
      </List>
    )}
  </div>
);

export default GroupsList;