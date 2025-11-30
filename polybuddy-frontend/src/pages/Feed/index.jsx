import React from 'react';
import { useOutletContext } from "react-router-dom";
import ProfileCard from './components/ProfileCard';
import { profilesData } from '../data/profiles';
import Paper from "@mui/material/Paper";
import SearchIcon from "@mui/icons-material/Search";
import './Feed.css';

const Feed = () => {
  const { getAvatarUrl } = useOutletContext();

  return (
    <div className="feed-main">
        <Paper elevation={1} className="search-bar">
          <SearchIcon sx={{ fontSize: 43, color: "text.secondary", marginRight: 2 }} />
        </Paper>

        <div className="feed-scroll-area">
          <div className="profiles-grid">
            {profilesData.map((profile) => (
              <ProfileCard
                key={profile.id}
                {...profile} 
                getAvatarUrl={getAvatarUrl} 
              />
            ))}
          </div>
        </div>
    </div>
  );
};
export default Feed;