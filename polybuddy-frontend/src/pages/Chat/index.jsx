import React, { useState } from "react";
import { useOutletContext } from "react-router-dom"; // To access props passed from Layout
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import SearchIcon from "@mui/icons-material/Search";

import GroupsList from "./components/ChatList/GroupsList";
import PeopleList from "./components/ChatList/PeopleList";
import ChatHeader from "./components/ChatWindow/ChatHeader";
import ChatMessages from "./components/ChatWindow/ChatMessages";
import MessageInput from "./components/ChatWindow/MessageInput";

import { groupsData } from "../data/groups";
import { peopleData } from "../data/people";
import { messagesData } from "../data/messages";
import "./Chat.css";

const Messaging = () => {
  const [messageInput, setMessageInput] = useState("");
  const { getAvatarUrl, isLoading } = useOutletContext(); 

  return (
    <Box className="messaging-inner-wrapper"> 
      <Stack className="left-column">
        {/* Search Bar */}
        <Paper elevation={1} className="search-bar">
          <SearchIcon sx={{ fontSize: 43, color: "text.secondary", marginRight: 2 }} />
        </Paper>

        {/* Groups List */}
        <Paper elevation={1} className="groups-panel">
          <GroupsList
            groups={groupsData}
            isLoading={isLoading}
            getAvatarUrl={getAvatarUrl}
            onSelect={() => {}}
          />
        </Paper>

        {/* People List */}
        <Paper elevation={1} className="people-panel">
          <PeopleList
            people={peopleData}
            isLoading={isLoading}
            getAvatarUrl={getAvatarUrl}
            onSelect={() => {}}
          />
        </Paper>
      </Stack>

      {/* Chat Window */}
      <Paper elevation={1} className="chat-window">
        <ChatHeader isLoading={isLoading} getAvatarUrl={getAvatarUrl} />
        <ChatMessages messages={messagesData} />
        <MessageInput
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
        />
      </Paper>
    </Box>
  );
};

export default Messaging;