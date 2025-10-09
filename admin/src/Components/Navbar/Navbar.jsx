import React from "react";
import "./Navbar.css";
import navLogo from "../../assets/nav-logo.svg";

const Navbar = () => {
  return (
    <div className="navbar">
      <img src={navLogo} alt="Logo" className="nav-logo" />
      <h2>Admin Dashboard</h2>
    </div>
  );
};

export default Navbar;
