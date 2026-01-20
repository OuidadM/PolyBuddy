import React, { useState, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Button, Avatar, Chip, Box, Select, MenuItem,
  FormControl, InputLabel, InputAdornment, IconButton
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import FilterListIcon from '@mui/icons-material/FilterList';
import conversationService from "../../../../services/conversation.service";
import profileService from "../../../../services/profile.service";
import "./CreateGroupModal.css";

const specialites = ["BAT", "GBS", "PEIP", "QIF", "SAGI"];
const niveaux = ["1", "2", "3", "4", "5"];

export default function CreateGroupModal({ open, onClose, onCreated }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Recherche et filtres
  const [query, setQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    role: "",
    specialite: "",
    niveau: "",
    gender: ""
  });

  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState([]);
  const [searching, setSearching] = useState(false);

  /* ================= SEARCH USERS (AJAX REAL-TIME) ================= */
  useEffect(() => {
    // Si moins de 2 caractères, ne pas chercher
    if (query.trim().length < 2) {
      setResults([]);
      setSearching(false);
      return;
    }

    setSearching(true);
    const timeout = setTimeout(async () => {
      try {
        const res = await conversationService.searchStudents({
          query,
          ...filters
        });
        // ✅ FIX: Le backend retourne { success: true, data: [...] }
        setResults(res?.data || []);
      } catch (err) {
        console.error("Search error:", err);
        setResults([]);
      } finally {
        setSearching(false);
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
      alert("Erreur lors de l'upload de l'avatar");
    }
  };

  /* ================= CREATE GROUP ================= */
  const handleCreate = async () => {
    if (!name.trim()) {
      alert("Le nom du groupe est obligatoire");
      return;
    }

    if (selected.length === 0) {
      alert("Ajoutez au moins un membre au groupe");
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
      handleClose();
    } catch (err) {
      console.error("Create group error:", err);
      alert("Erreur lors de la création du groupe");
    }
  };

  const handleSelectUser = (user) => {
    if (selected.find(u => u.id === user.id)) return;
    setSelected(prev => [...prev, user]);
    setQuery(""); // Clear search après sélection
    setResults([]);
  };

  const handleRemoveUser = (userId) => {
    setSelected(selected.filter(u => u.id !== userId));
  };

  const handleClose = () => {
    setName("");
    setDescription("");
    setAvatar(null);
    setAvatarPreview(null);
    setQuery("");
    setSelected([]);
    setResults([]);
    setFilters({ role: "", specialite: "", niveau: "", gender: "" });
    onClose();
  };

  const resetFilters = () => {
    setFilters({ role: "", specialite: "", niveau: "", gender: "" });
  };

  /* ================= RENDER ================= */
  return (
    <Dialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '24px',
          padding: '10px'
        }
      }}
    >
      <DialogTitle sx={{ 
        textAlign: 'center', 
        fontSize: '24px', 
        fontWeight: 700,
        color: '#1d3039',
        paddingBottom: '10px'
      }}>
        Créer un groupe
      </DialogTitle>

      <DialogContent sx={{ paddingTop: '20px !important' }}>
        {/* AVATAR */}
        <Box className="create-group-avatar-wrapper">
          <Box className="create-group-avatar-circle">
            <Avatar
              src={avatarPreview}
              sx={{ width: '100%', height: '100%' }}
            >
              {!avatarPreview && name.charAt(0).toUpperCase()}
            </Avatar>
          </Box>
          <Button 
            component="label" 
            className="create-group-avatar-btn"
            sx={{ 
              textTransform: 'none',
              color: '#019EE6',
              fontWeight: 600,
              fontSize: '15px'
            }}
          >
            Ajouter un avatar
            <input
              hidden
              type="file"
              accept="image/*"
              onChange={e => handleAvatar(e.target.files[0])}
            />
          </Button>
        </Box>

        {/* NOM ET DESCRIPTION */}
        <Box className="create-group-form">
          <TextField
            label="Nom du groupe *"
            fullWidth
            value={name}
            onChange={e => setName(e.target.value)}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '16px',
                '&:hover fieldset': {
                  borderColor: '#019EE6',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#019EE6',
                  borderWidth: '2px'
                }
              }
            }}
          />

          <TextField
            label="Description"
            fullWidth
            multiline
            rows={3}
            value={description}
            onChange={e => setDescription(e.target.value)}
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '16px',
                '&:hover fieldset': {
                  borderColor: '#019EE6',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#019EE6',
                  borderWidth: '2px'
                }
              }
            }}
          />
        </Box>

        {/* RECHERCHE */}
        <Box className="create-group-search-wrapper">
          <TextField
            fullWidth
            placeholder="Rechercher par nom ou prénom..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#6b7280' }} />
                </InputAdornment>
              ),
              endAdornment: query && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setQuery("")}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              )
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '18px',
                backgroundColor: '#f9fafb',
                '&:hover fieldset': {
                  borderColor: '#019EE6',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#019EE6',
                  borderWidth: '2px'
                }
              }
            }}
          />

          {/* BOUTON FILTRES */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
            <Button
              startIcon={<FilterListIcon />}
              onClick={() => setShowFilters(!showFilters)}
              sx={{ 
                textTransform: 'none',
                color: showFilters ? '#019EE6' : '#6b7280',
                fontWeight: 600
              }}
            >
              {showFilters ? 'Masquer les filtres' : 'Afficher les filtres'}
            </Button>
            {(filters.role || filters.specialite || filters.niveau || filters.gender) && (
              <Button
                size="small"
                onClick={resetFilters}
                sx={{ textTransform: 'none', color: '#ef4444' }}
              >
                Réinitialiser
              </Button>
            )}
          </Box>

          {/* FILTRES */}
          {showFilters && (
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(2, 1fr)', 
              gap: 2, 
              mt: 2,
              padding: '16px',
              backgroundColor: '#f8fafc',
              borderRadius: '16px'
            }}>
              <FormControl fullWidth size="small">
                <InputLabel>Rôle</InputLabel>
                <Select
                  value={filters.role}
                  label="Rôle"
                  onChange={e => setFilters({ ...filters, role: e.target.value })}
                  sx={{ borderRadius: '12px' }}
                >
                  <MenuItem value="">Tous</MenuItem>
                  <MenuItem value="student">Étudiant</MenuItem>
                  <MenuItem value="alumni">Alumni</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel>Spécialité</InputLabel>
                <Select
                  value={filters.specialite}
                  label="Spécialité"
                  onChange={e => setFilters({ ...filters, specialite: e.target.value })}
                  sx={{ borderRadius: '12px' }}
                >
                  <MenuItem value="">Toutes</MenuItem>
                  {specialites.map(s => (
                    <MenuItem key={s} value={s.toLowerCase()}>{s}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel>Niveau</InputLabel>
                <Select
                  value={filters.niveau}
                  label="Niveau"
                  onChange={e => setFilters({ ...filters, niveau: e.target.value })}
                  sx={{ borderRadius: '12px' }}
                >
                  <MenuItem value="">Tous</MenuItem>
                  {niveaux.map(n => (
                    <MenuItem key={n} value={n}>Niveau {n}</MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth size="small">
                <InputLabel>Genre</InputLabel>
                <Select
                  value={filters.gender}
                  label="Genre"
                  onChange={e => setFilters({ ...filters, gender: e.target.value })}
                  sx={{ borderRadius: '12px' }}
                >
                  <MenuItem value="">Tous</MenuItem>
                  <MenuItem value="M">Homme</MenuItem>
                  <MenuItem value="F">Femme</MenuItem>
                  <MenuItem value="A">Autre</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}

          {/* RÉSULTATS DE RECHERCHE */}
          {query.length >= 2 && (
            <Box className="create-group-search-results">
              {searching ? (
                <Box sx={{ textAlign: 'center', py: 2, color: '#6b7280' }}>
                  Recherche en cours...
                </Box>
              ) : results.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 2, color: '#6b7280' }}>
                  Aucun résultat trouvé
                </Box>
              ) : (
                results.map(user => (
                  <Box
                    key={user.id}
                    className="create-group-search-item"
                    onClick={() => handleSelectUser(user)}
                  >
                    <Avatar 
                      src={user.avatar_url} 
                      alt={user.prenom}
                      sx={{ width: 44, height: 44 }}
                    >
                      {user.prenom?.charAt(0)}
                    </Avatar>
                    <Box sx={{ flex: 1 }}>
                      <Box className="create-group-search-name">
                        {user.prenom} {user.nom}
                      </Box>
                      <Box className="create-group-search-meta">
                        {user.specialite} {user.niveau ? `• Niveau ${user.niveau}` : ''}
                      </Box>
                    </Box>
                  </Box>
                ))
              )}
            </Box>
          )}
        </Box>

        {/* MEMBRES SÉLECTIONNÉS */}
        {selected.length > 0 && (
          <Box sx={{ mt: 3 }}>
            <Box sx={{ 
              fontSize: '14px', 
              fontWeight: 600, 
              color: '#6b7280', 
              mb: 1.5 
            }}>
              Membres sélectionnés ({selected.length})
            </Box>
            <Box className="create-group-selected">
              {selected.map(user => (
                <Chip
                  key={user.id}
                  avatar={<Avatar src={user.avatar_url}>{user.prenom?.charAt(0)}</Avatar>}
                  label={`${user.prenom} ${user.nom}`}
                  onDelete={() => handleRemoveUser(user.id)}
                  sx={{
                    borderRadius: '14px',
                    padding: '6px 4px',
                    fontSize: '14px',
                    fontWeight: 500,
                    backgroundColor: '#e0f2fe',
                    color: '#0369a1',
                    '& .MuiChip-deleteIcon': {
                      color: '#0369a1',
                      '&:hover': {
                        color: '#075985'
                      }
                    }
                  }}
                />
              ))}
            </Box>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ padding: '20px 24px' }}>
        <Button 
          onClick={handleClose}
          sx={{ 
            textTransform: 'none',
            color: '#6b7280',
            fontWeight: 600,
            fontSize: '15px'
          }}
        >
          Annuler
        </Button>
        <Button 
          variant="contained" 
          onClick={handleCreate}
          disabled={!name.trim() || selected.length === 0}
          sx={{
            textTransform: 'none',
            backgroundColor: '#019EE6',
            borderRadius: '18px',
            padding: '10px 32px',
            fontWeight: 600,
            fontSize: '15px',
            boxShadow: '0 4px 12px rgba(1, 158, 230, 0.3)',
            '&:hover': {
              backgroundColor: '#0288d1',
              boxShadow: '0 6px 16px rgba(1, 158, 230, 0.4)',
              transform: 'translateY(-2px)'
            },
            '&:disabled': {
              backgroundColor: '#d1d5db',
              color: '#9ca3af'
            },
            transition: 'all 0.3s ease'
          }}
        >
          Créer le groupe
        </Button>
      </DialogActions>
    </Dialog>
  );
}