import React, { useState } from 'react';
import './AdminPanel.css';
import NavbarLogo from '../components/Navbar/Navbar';
import adminPanelData from '../../pages/data/adminPanelData.jsx';

const AdminPanel = () => {
  const [students, setStudents] = useState(adminPanelData);
  const [filter, setFilter] = useState("En attente");
  const [expandedRow, setExpandedRow] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedDoc, setSelectedDoc] = useState(null);

  const filteredStudents = students.filter(s => s.status === filter);

  const handleAction = (id, newStatus) => {
    setStudents(students.map(s => s.id === id ? { ...s, status: newStatus } : s));
  };

  const toggleRow = (id) => {
    setExpandedRow(expandedRow === id ? null : id);
  };

  return (
    <>
      <NavbarLogo />
      <div className="admin-container">
        <header className="admin-header">
          <h1>Bonjour Admin, il y a {students.filter(s => s.status === "En attente").length} demandes en attente.</h1>
        </header>

        <div className="filter-tabs">
          {["En attente", "Approuvés", "Refusés"].map(status => (
            <button 
              key={status} 
              className={filter === status ? "active" : ""} 
              onClick={() => setFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>

        <div className="table-wrapper">
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
              {filteredStudents.map(student => (
                <React.Fragment key={student.id}>
                  <tr className={expandedRow === student.id ? "row-selected" : ""}>
                    {/* Suppression de l'élément img ici */}
                    <td className="user-cell" onClick={() => toggleRow(student.id)}>
                      <span className="name-with-arrow">
                         {expandedRow === student.id ? "▾" : "▸"} {student.nom}
                      </span>
                    </td>
                    <td><span className={`badge ${student.type.toLowerCase()}`}>{student.type}</span></td>
                    <td>{student.date}</td>
                    <td><a href={`mailto:${student.email}`} className="email-link">{student.email}</a></td>
                    <td>
                      <button className="icon-btn" onClick={() => {setSelectedDoc(student.nom); setShowModal(true)}}>
                        📄
                      </button>
                    </td>
                    <td className="action-btns">
                      <button className="btn-accept" onClick={() => handleAction(student.id, "Approuvés")}>
                        Accepter
                      </button>
                      <button className="btn-refuse" onClick={() => handleAction(student.id, "Refusés")}>
                        Refuser
                      </button>
                    </td>
                  </tr>
                  {expandedRow === student.id && (
                    <tr className="detail-row">
                      <td colSpan="6">
                        <div className="details-content">
                          <ul>
                            <li><strong>Téléphone :</strong> {student.tel}</li>
                            <li><strong>Établissement :</strong> {student.ecole}</li>
                            <li><strong>Filière :</strong> {student.filiere}</li>
                            <li><strong>Année diplôme :</strong> {student.annee}</li>
                            <li><strong>Adresse :</strong> {student.adresse}</li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Justificatif de {selectedDoc}</h3>
                <button className="close-btn" onClick={() => setShowModal(false)}>×</button>
              </div>
              <div className="modal-body">
                <div className="placeholder-doc">
                  [ Aperçu du document ]
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default AdminPanel;