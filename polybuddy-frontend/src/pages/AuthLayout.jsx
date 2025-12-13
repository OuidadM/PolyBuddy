import React from "react";
import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div style={{ padding: "1rem" }}>
      <Outlet />
    </div>
  );
}
