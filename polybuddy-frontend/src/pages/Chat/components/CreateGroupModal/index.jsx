import React, { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Avatar, Chip, Box, Select, MenuItem
} from "@mui/material";
import conversationService from "../../../../services/conversation.service";
import profileService from "../../../../services/profile.service";

const specialites = ["bat", "gbs", "peip", "qif", "sagi"];

export default function CreateGroupModal({ open, onClose, onCreated }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({
    role: "",
    specialite: "",
    interest: "",
    niveau: ""
  });

  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState([]);

  /* ================= SEARCH USERS (DEBOUNCED) ================= */
  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      try {
        const res = await conversationService.searchStudents({
          query,
          ...filters
        });
        setResults(res);
      } catch (err) {
        console.error("Search error:", err);
      }
    }, 300);

    return () => clearTimeout(timeout);
  }, [query, filters]);

  /* ================= AVATAR ================= */
  const handleAvatar = async (file) => {
    if (!file) return;
    setAvatarPreview(URL.createObjectURL(file));

    try {
      const res = await profileService.uploadAvatar(file);
      setAvatar(res.avatarUrl);
    } catch (err) {
      console.error("Avatar upload error:", err);
    }
  };

  /* ================= CREATE GROUP ================= */
  const handleCreate = async () => {
    if (!name.trim()) {
      alert("Nom du groupe obligatoire");
      return;
    }

    try {
      await conversationService.createGroup({
        nom: name,
        description,
        avatar,
        members: selected.map(u => u.id)
      });

      onCreated();
      onClose();
    } catch (err) {
      console.error("Create group error:", err);
      alert("Erreur lors de la création du groupe");
    }
  };

  const handleSelectUser = (user) => {
    if (selected.find(u => u.id === user.id)) return;
    setSelected(prev => [...prev, user]);
  };

  /* ================= RENDER ================= */
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Créer un groupe</DialogTitle>

      <DialogContent>
        {/* AVATAR */}
        <Box textAlign="center" mb={3}>
          <Avatar
            src={avatarPreview}
            sx={{ width: 80, height: 80, margin: "0 auto" }}
          />
          <Button component="label" sx={{ mt: 1 }}>
            Ajouter un avatar
            <input
              hidden
              type="file"
              accept="image/*"
              onChange={e => handleAvatar(e.target.files[0])}
            />
          </Button>
        </Box>

        <TextField
          label="Nom du groupe *"
          fullWidth
          value={name}
          onChange={e => setName(e.target.value)}
        />

        <TextField
          label="Description"
          fullWidth
          multiline
          rows={2}
          value={description}
          onChange={e => setDescription(e.target.value)}
          sx={{ mt: 2 }}
        />

        {/* SEARCH */}
        <TextField
          label="Rechercher des membres"
          fullWidth
          value={query}
          onChange={e => setQuery(e.target.value)}
          sx={{ mt: 3 }}
        />

        {/* FILTERS */}
        <Box display="flex" gap={2} mt={2}>
          <Select
            fullWidth
            value={filters.role}
            onChange={e => setFilters({ ...filters, role: e.target.value })}
          >
            <MenuItem value="">Tous</MenuItem>
            <MenuItem value="student">Étudiant</MenuItem>
            <MenuItem value="alumni">Alumni</MenuItem>
          </Select>

          <Select
            fullWidth
            value={filters.specialite}
            onChange={e => setFilters({ ...filters, specialite: e.target.value })}
          >
            <MenuItem value="">Spécialité</MenuItem>
            {specialites.map(s => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </Select>
        </Box>

        {/* RESULTS */}
        <Box mt={2}>
          {results.map(u => (
            <Chip
              key={u.id}
              label={`${u.prenom} ${u.nom}`}
              onClick={() => handleSelectUser(u)}
              sx={{ mr: 1, mb: 1, cursor: "pointer" }}
            />
          ))}
        </Box>

        {/* SELECTED */}
        <Box mt={2}>
          {selected.map(u => (
            <Chip
              key={u.id}
              label={`${u.prenom} ${u.nom}`}
              onDelete={() =>
                setSelected(selected.filter(s => s.id !== u.id))
              }
              sx={{ mr: 1, mb: 1 }}
            />
          ))}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button variant="contained" onClick={handleCreate}>
          Créer
        </Button>
      </DialogActions>
    </Dialog>
  );
}
