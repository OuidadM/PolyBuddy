import React, { useState, useEffect } from "react";
import { useOutletContext, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/AuthContext";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import SearchIcon from "@mui/icons-material/Search";
import {Divider} from "@mui/material";

import GroupsList from "./components/ChatList/GroupsList"
import CreateGroupModal from "./components/CreateGroupModal/index.jsx";
import PeopleList from "./components/ChatList/PeopleList";
import ChatHeader from "./components/ChatWindow/ChatHeader";
import ChatMessages from "./components/ChatWindow/ChatMessages";
import MessageInput from "./components/ChatWindow/MessageInput";
import conversationService from "../../services/conversation.service";

import "./Chat.css";

const Messaging = () => {
  const [groups, setGroups] = useState([]);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [openCreateGroup, setOpenCreateGroup] = useState(false);
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [currentConversationId, setCurrentConversationId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageInput, setMessageInput] = useState("");
  const [loadingFriends, setLoadingFriends] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  
  const { getAvatarUrl, isLoading } = useOutletContext();
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  // Charger une conversation depuis l'état de navigation (depuis ProfileCard)
  useEffect(() => {
    if (location.state?.friendId) {
      handleSelectFriendById(location.state.friendId);
    }
  }, [location.state]);

  

  useEffect(() => {
    loadFriends();
    loadGroups();
  }, []);

  const loadGroups = async () => {
    try {
      setLoadingGroups(true);
      const response = await conversationService.getGroups();
      setGroups(response || []);
    } catch (e) {
      console.error("Erreur chargement groupes", e);
    } finally {
      setLoadingGroups(false);
    }
  };

  // Charger les amis
  const loadFriends = async () => {
    try {
      setLoadingFriends(true);
      const response = await conversationService.getFriends();
      setFriends(response.data || []);
    } catch (error) {
      console.error("Erreur chargement amis:", error);
    } finally {
      setLoadingFriends(false);
    }
  };

  // Sélectionner un ami par ID (depuis ProfileCard)
  const handleSelectFriendById = async (friendId) => {
    const friend = friends.find(f => f.id === friendId);
    if (friend) {
      handleSelectFriend(friend);
    } else {
      // Si l'ami n'est pas dans la liste, le charger
      try {
        const response = await conversationService.getOrCreateConversation(friendId);
        if (response.data?.conversationId) {
          setCurrentConversationId(response.data.conversationId);
          loadMessages(response.data.conversationId);
        }
      } catch (error) {
        console.error("Erreur création conversation:", error);
      }
    }
  };

  // Sélectionner un ami depuis la liste
  const handleSelectFriend = async (friend) => {
    setSelectedFriend(friend);
    setLoadingMessages(true);
    
    try {
      // Créer ou récupérer la conversation
      const response = await conversationService.getOrCreateConversation(friend.id);
      setCurrentConversationId(response.data.conversationId);
      
      // Charger les messages
      await loadMessages(response.data.conversationId);
    } catch (error) {
      console.error("Erreur lors de la sélection:", error);
    } finally {
      setLoadingMessages(false);
    }
  };

  // Charger les messages d'une conversation
  const loadMessages = async (conversationId) => {
    try {
      const response = await conversationService.getMessages(conversationId);
      setMessages(response.data || []);
      
      // Marquer les messages comme lus
      await conversationService.markAsRead(conversationId);
    } catch (error) {
      console.error("Erreur chargement messages:", error);
    }
  };

  // Envoyer un message
  const handleSendMessage = async () => {
    if (!messageInput.trim() || !currentConversationId) return;

    try {
      await conversationService.sendMessage(currentConversationId, messageInput);
      
      // Recharger les messages
      await loadMessages(currentConversationId);
      
      // Vider l'input
      setMessageInput("");
    } catch (error) {
      console.error("Erreur envoi message:", error);
    }
  };

  // FORMATTER les groupes pour GroupsList
  const formattedGroups = groups.map(group => ({
    id: group.id,
    name: group.name,
    avatar: group.avatar,
    message: group.lastMessage || "Groupe",
    time: "",
    hasCheck: false,
    badge: null,
    type: "group"
  }));

  // Formatter les données des amis pour PeopleList
  const formattedFriends = friends.map(friend => ({
    id: friend.id,
    name: friend.name,
    avatarUrl: friend.avatar,
    message: friend.specialite || "Étudiant",
    time: "",
    hasCheck: false,
    badge: null,
    isAlumni: friend.isAlumni
  }));

  return (
    <Box className="messaging-inner-wrapper"> 
      <Stack className="left-column">
        {/* Search Bar */}
        <Paper elevation={1} className="search-bar">
          <SearchIcon sx={{ fontSize: 43, color: "text.secondary", marginRight: 2 }} />
        </Paper>

        {/* Friends List */}
        <Paper elevation={1} className="people-panel">
          {/* GROUPES */}
          <GroupsList
            groups={formattedGroups}
            isLoading={loadingGroups}
            getAvatarUrl={getAvatarUrl}
            onSelect={(groupName) => {
              const group = groups.find(g => g.name === groupName);
              if (group) {
                setCurrentConversationId(group.id);
                loadMessages(group.id);
                setSelectedFriend({ name: group.name, isGroup: true });
              }
            }}
            canCreateGroup={user?.role === 'alumni'}
            onCreateGroup={() => setOpenCreateGroup(true)}
          />

          {openCreateGroup && (
          <CreateGroupModal
            open={openCreateGroup}
            onClose={() => setOpenCreateGroup(false)}
            onCreated={loadGroups}
          />
        )}

          <Divider sx={{ my: 2 }} />
          <PeopleList
            people={formattedFriends}
            isLoading={loadingFriends}
            getAvatarUrl={getAvatarUrl}
            onSelect={(friendName) => {
              const friend = friends.find(f => f.name === friendName);
              if (friend) handleSelectFriend(friend);
            }}
          />
        </Paper>
      </Stack>

      {/* Chat Window */}
      <Paper elevation={1} className="chat-window">
        {selectedFriend ? (
          <>
            <ChatHeader 
              isLoading={isLoading} 
              getAvatarUrl={getAvatarUrl}
              friend={selectedFriend}
            />
            {loadingMessages ? (
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                height: '100%' 
              }}>
                <Typography>Chargement des messages...</Typography>
              </Box>
            ) : (
              <>
                <ChatMessages 
                  messages={messages} 
                  currentUserId={user?.id} 
                />
                <MessageInput
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onSend={handleSendMessage}
                />
              </>
            )}
          </>
        ) : (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '100%',
            color: 'text.secondary' 
          }}>
            <Typography variant="h6">
              Sélectionnez un ami pour commencer à discuter
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Messaging;