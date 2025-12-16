import React from "react";
import "./Transition.css";
import loopImage from "../../assets/loop.png";

export default function Transition() {
  return (
    <div className="transition">
      <img src={loopImage} alt="loop" />
    </div>
  );
}