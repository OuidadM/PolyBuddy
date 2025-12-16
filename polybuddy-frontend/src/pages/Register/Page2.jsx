import React from "react";
import "./Page2.css";

import Graduate from "../Home/assets/Graduate.png";
import Vector from "../Home/assets/Vector.png";
import Orange from "../Home/assets/Orange.png";
import Vert from "../Home/assets/Vert.png";
import Rose from "../Home/assets/Rose.png";
import Mauve from "../Home/assets/Mauve.png";
import Saumon from "../Home/assets/Saumon.png";

const countries = [
  { code: "+33", flag: "🇫🇷" },
  { code: "+216", flag: "🇹🇳" },
  { code: "+212", flag: "🇲🇦" },
  { code: "+32", flag: "🇧🇪" },
  { code: "+49", flag: "🇩🇪" },
  { code: "+44", flag: "🇬🇧" },
];

export default function RegisterPhase3() {
  return (
    <div className="acces-container">

      <img src={Graduate} className="bg-img graduate" alt="" />
      <img src={Vector} className="bg-img vector" alt="" />

      <h1 className="top-title">Rejoins-nous</h1>

      <img src={Orange} className="avatar avatar-1" alt="" />
      <img src={Vert} className="avatar avatar-2" alt="" />
      <img src={Rose} className="avatar avatar-3" alt="" />
      <img src={Mauve} className="avatar avatar-4" alt="" />
      <img src={Saumon} className="avatar avatar-5" alt="" />
      <img src={Saumon} className="avatar avatar-6" alt="" />

      <div className="acces-box">

        <div className="phone-wrapper">
          <select className="phone-select">
            <option value="">Indicatif</option>
            {countries.map((c) => (
              <option key={c.code}>{c.flag} {c.code}</option>
            ))}
          </select>

          <input type="tel" className="input-field phone-input" placeholder="Numéro de téléphone" />
        </div>

        <input type="text" className="input-field" placeholder="Adresse" />
        <input type="text" className="input-field" placeholder="Ville" />
        <input type="text" className="input-field" placeholder="Code postal" />
        <input type="text" className="input-field" placeholder="Rue" />
        <input type="text" className="input-field" placeholder="Complément d'adresse (optionnel)" />

        <button className="next-btn">Suivant</button>
      </div>
    </div>
  );
}
