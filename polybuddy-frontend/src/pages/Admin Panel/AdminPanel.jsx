import React, { useState, useEffect } from 'react';
import './AdminPanel.css';
import NavbarLogo from '../components/Navbar/Navbar';
import adminService from '../../services/admin.service';

const AdminPanel = () => {
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState(null);
  const [filter, setFilter] = useState("en_cours");
  const [expandedRow, setExpandedRow] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(100); // ✅ État pour le zoom

  // Mapper les statuts front/back
  const STATUS_MAP = {
    "en_cours": "En attente",
    "verifie": "Approuvés",
    "rejete": "Refusés"
  };

  const REVERSE_STATUS_MAP = {
    "En attente": "en_cours",
    "Approuvés": "verifie",
    "Refusés": "rejete"
  };

  // Charger les étudiants au montage et quand le filtre change
  useEffect(() => {
    fetchStudents();
    fetchStats();
  }, [filter]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // ✅ filter est déjà en format backend ("en_cours", "verifie", "rejete")
      console.log("🔍 Filtre utilisé:", filter); // DEBUG
      const response = await adminService.getStudents(filter);

      // ✅ DEBUG STRUCTURE BACKEND
      console.log("📦 Backend raw data:", response.data);
      console.log("📦 Premier étudiant:", response.data?.[0]);
      console.log("📦 user du 1er étudiant:", response.data?.[0]?.user);
      console.log("📦 address du user:", response.data?.[0]?.user?.address);

      
      // Transformer les données pour correspondre au format attendu par le composant
      const transformedData = response.data.map(student => ({
        id: student.id,
        nom: `${student.user.prenom} ${student.user.nom}`,
        type: student.type, // "Étudiant" ou "Alumni"
        date: new Date(student.createdAt).toLocaleDateString('fr-FR'),
        email: student.user.email,
        tel: student.user.numero,
        filiere: student.specialite,
        annee: student.alumni?.annee_diplome || student.niveau || "N/A",
        adresse: student.user.address 
          ? `${student.user.address.street}, ${student.user.address.postalCode} ${student.user.address.city}`
          : "Non renseignée",
        status: STATUS_MAP[student.verification_status],
        justificatif: student.justificatif_url,
        // Infos supplémentaires
        num_etudiant: student.num_etudiant,
        mail_univ: student.mail_univ,
        centres_interet: student.centres_interet,
        // Alumni info
        position: student.alumni?.position,
        entreprise: student.alumni?.entreprise
      }));

      setStudents(transformedData);
    } catch (err) {
      console.error("Erreur chargement étudiants:", err);
      setError("Erreur lors du chargement des données");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await adminService.getStats();
      setStats(response.stats);
    } catch (err) {
      console.error("Erreur chargement stats:", err);
    }
  };

  const handleAction = async (id, newStatus) => {
    try {
      if (newStatus === "Approuvés") {
        await adminService.approveStudent(id);
      } else if (newStatus === "Refusés") {
        await adminService.rejectStudent(id);
      }

      // Recharger les données
      await fetchStudents();
      await fetchStats();

      alert(`Demande ${newStatus.toLowerCase()} avec succès`);
    } catch (err) {
      console.error("Erreur action:", err);
      alert("Erreur lors de l'action");
    }
  };

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  // ✅ Fonctions de gestion du zoom
  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 25, 200)); // Max 200%
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 25, 50)); // Min 50%
  };

  const handleZoomReset = () => {
    setZoomLevel(100);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setZoomLevel(100); // Reset zoom à la fermeture
  };

  if (loading && students.length === 0) {
    return (
      <>
        <NavbarLogo />
        <div className="admin-container">
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <p>Chargement...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <NavbarLogo />
        <div className="admin-container">
          <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
            <p>{error}</p>
            <button onClick={fetchStudents}>Réessayer</button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <NavbarLogo />
      <div className="admin-container">
        <header className="admin-header">
          <h1>
            Bonjour Admin, il y a {stats?.en_cours || 0} demandes en attente.
          </h1>
        </header>

        <div className="filter-tabs">
          {["En attente", "Approuvés", "Refusés"].map(status => (
            <button 
              key={status} 
              className={filter === REVERSE_STATUS_MAP[status] ? "active" : ""} 
              onClick={() => {
                const newFilter = REVERSE_STATUS_MAP[status];
                console.log("🔄 Changement de filtre:", newFilter); // DEBUG
                setFilter(newFilter);
              }}
            >
              {status} ({stats?.[REVERSE_STATUS_MAP[status]] || 0})
            </button>
          ))}
        </div>

        <div className="table-wrapper">
          {students.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '20px' }}>
              Aucune demande avec ce statut
            </p>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Étudiant</th>
                  <th>Type</th>
                  <th>Date</th>
                  <th>Email</th>
                  <th>Justificatif</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => (
                  <React.Fragment key={student.id}>
                    <tr className={expandedRow === student.id ? "row-selected" : ""}>
                      <td className="user-cell" onClick={() => toggleRow(student.id)}>
                        <span className="name-with-arrow">
                          {expandedRow === student.id ? "▾" : "▸"} {student.nom}
                        </span>
                      </td>
                      <td>
                        <span className={`badge ${student.type.toLowerCase()}`}>
                          {student.type}
                        </span>
                      </td>
                      <td>{student.date}</td>
                      <td>
                        <a href={`mailto:${student.email}`} className="email-link">
                          {student.email}
                        </a>
                      </td>
                      <td>
                        {student.justificatif ? (
                          <button 
                            className="icon-btn" 
                            onClick={() => {
                              setSelectedDoc({ nom: student.nom, url: student.justificatif });
                              setShowModal(true);
                            }}
                          >
                            📄
                          </button>
                        ) : (
                          <span style={{ color: '#999' }}>-</span>
                        )}
                      </td>
                      <td className="action-btns">
                        {filter === "en_cours" && (
                          <>
                            <button 
                              className="btn-accept" 
                              onClick={() => handleAction(student.id, "Approuvés")}
                            >
                              Accepter
                            </button>
                            <button 
                              className="btn-refuse" 
                              onClick={() => handleAction(student.id, "Refusés")}
                            >
                              Refuser
                            </button>
                          </>
                        )}
                        {filter !== "en_cours" && (
                          <span style={{ color: '#999' }}>
                            {STATUS_MAP[filter]}
                          </span>
                        )}
                      </td>
                    </tr>
                    {expandedRow === student.id && (
                      <tr className="detail-row">
                        <td colSpan="6">
                          <div className="details-content">
                            <ul>
                              <li><strong>Téléphone :</strong> {student.tel || "Non renseigné"}</li>
                              <li><strong>Filière :</strong> {student.filiere}</li>
                              {student.type === "Alumni" ? (
                                <>
                                  <li><strong>Année diplôme :</strong> {student.annee}</li>
                                  <li><strong>Poste actuel :</strong> {student.position || "Non renseigné"}</li>
                                  <li><strong>Entreprise :</strong> {student.entreprise || "Non renseignée"}</li>
                                </>
                              ) : (
                                <li><strong>Niveau :</strong> {student.annee}</li>
                              )}
                              <li><strong>Adresse :</strong> {student.adresse}</li>
                              {student.mail_univ && (
                                <li><strong>Email universitaire :</strong> {student.mail_univ}</li>
                              )}
                              {student.num_etudiant && (
                                <li><strong>Numéro étudiant :</strong> {student.num_etudiant}</li>
                              )}
                            </ul>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {showModal && selectedDoc && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Justificatif de {selectedDoc.nom}</h3>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  {/* Contrôles de zoom */}
                  <button 
                    className="zoom-btn" 
                    onClick={handleZoomOut}
                    title="Zoom arrière"
                    style={{
                      padding: '5px 10px',
                      background: '#f0f0f0',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '18px'
                    }}
                  >
                    −
                  </button>
                  <span style={{ 
                    fontSize: '14px', 
                    color: '#666',
                    minWidth: '50px',
                    textAlign: 'center'
                  }}>
                    {zoomLevel}%
                  </span>
                  <button 
                    className="zoom-btn" 
                    onClick={handleZoomIn}
                    title="Zoom avant"
                    style={{
                      padding: '5px 10px',
                      background: '#f0f0f0',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '18px'
                    }}
                  >
                    +
                  </button>
                  <button 
                    className="zoom-btn" 
                    onClick={handleZoomReset}
                    title="Réinitialiser"
                    style={{
                      padding: '5px 12px',
                      background: '#f0f0f0',
                      border: '1px solid #ccc',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    100%
                  </button>
                  <button className="close-btn" onClick={handleCloseModal}>×</button>
                </div>
              </div>
              <div className="modal-body" style={{ 
                overflow: 'auto',
                maxHeight: '70vh',
                padding: '20px' // ✅ Marge entre titre et contenu
              }}>
                {selectedDoc.url ? (
                  <div style={{ 
                    transform: `scale(${zoomLevel / 100})`,
                    transformOrigin: 'top center',
                    transition: 'transform 0.2s ease'
                  }}>
                    <iframe 
                      src={selectedDoc.url} 
                      style={{ 
                        width: `${100 * (100 / zoomLevel)}%`, // Ajuster la largeur selon le zoom
                        height: '600px',
                        border: 'none',
                        display: 'block',
                        margin: '0 auto'
                      }}
                      title="Justificatif"
                    />
                  </div>
                ) : (
                  <div className="placeholder-doc">
                    [ Aucun justificatif disponible ]
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminPanel;