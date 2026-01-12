import React from "react";
import { List, Typography, Divider, Box } from "@mui/material";
import ChatListItem from "../ChatListItem";

import "./PeopleList.css";

const PeopleList = ({ people, isLoading, getAvatarUrl, onSelect }) => (
  <div className="people-list-container">
    <Typography variant="h3" className="people-title">
      Amis
    </Typography>
    
    {people.length === 0 && !isLoading ? (
      <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
        <Typography variant="body2">
          Vous n'avez pas encore d'amis
        </Typography>
      </Box>
    ) : (
      <Box sx={{ maxHeight: '400px', overflowY: 'auto' }}>
        <List className="people-list">
          {people.map((person, index) => (
            <React.Fragment key={person.id}>
              <ChatListItem
                item={person}
                isLoading={isLoading}
                getAvatarUrl={getAvatarUrl}
                onClick={() => onSelect(person.name)}
              />
              {index < people.length - 1 && <Divider className="people-divider" />}
            </React.Fragment>
          ))}
        </List>
      </Box>
    )}
  </div>
);

export default PeopleList;