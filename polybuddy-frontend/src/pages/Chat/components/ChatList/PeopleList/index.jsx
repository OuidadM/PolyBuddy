import React from "react";
import { List, Typography, Divider } from "@mui/material";
import ChatListItem from "../ChatListItem";

import "./PeopleList.css";

const PeopleList = ({ people, isLoading, getAvatarUrl, onSelect }) => (
  <div className="people-list-container">
    <Typography variant="h3" className="people-title">
      People
    </Typography>
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
  </div>
);

export default PeopleList;