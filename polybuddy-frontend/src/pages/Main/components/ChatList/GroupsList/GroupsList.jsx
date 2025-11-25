import React from "react";
import { List, Typography, Divider } from "@mui/material";
import ChatListItem from "../ChatListItem/ChatListItem";

import "./GroupsList.css";

const GroupsList = ({ groups, isLoading, getAvatarUrl, onSelect }) => (
  <div className="groups-list-container">
    <Typography variant="h3" className="groups-title">
      Groups
    </Typography>

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
  </div>
);

export default GroupsList;
