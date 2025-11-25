import React, { useState } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import SearchIcon from "@mui/icons-material/Search";

import Sidebar from "../Sidebar/Sidebar";
import GroupsList from "../ChatList/GroupsList/GroupsList";
import PeopleList from "../ChatList/PeopleList/PeopleList";
import ChatHeader from "../ChatWindow/ChatHeader/ChatHeader";
import ChatMessages from "../ChatWindow/ChatMessages/ChatMessages";
import MessageInput from "../ChatWindow/MessageInput/MessageInput";

import { useAvatarGenerator } from "../hooks/useAvatarGenerator";
import { avatarPrompts } from "../data/avatarPrompts";
import { groupsData } from "../data/groups";
import { peopleData } from "../data/people";
import { messagesData } from "../data/messages";

import "./Messaging.css";

const API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/imagen-4.0-generate-001:predict";
const API_KEY = ""; // Replace with your API Key

const Messaging = () => {
  const [messageInput, setMessageInput] = useState("");
  const { getAvatarUrl, isLoading } = useAvatarGenerator(
    avatarPrompts,
    API_URL,
    API_KEY
  );

  return (
    <Box className="messaging-container">
      <Sidebar isLoading={isLoading} getAvatarUrl={getAvatarUrl} />

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
