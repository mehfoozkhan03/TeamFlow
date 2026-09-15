import { NavLink } from "react-router-dom";

import "../Style/Navbar.css";

export const Navbar = () => {
  return (
    <div className="navbar">
      <NavLink
        style={({ isActive }) => {
          return isActive ? { background: "tomato", color: "#ffff" } : null;
        }}
        to="/"
      >
        Home
      </NavLink>
      <NavLink
        style={({ isActive }) => {
          return isActive ? { background: "tomato",color:"#ffff" } : null;
        }}
        to="/about"
      >
        about
      </NavLink>
      <NavLink
        style={({ isActive }) => {
          return isActive ? { background: "tomato",color:"#ffff" } : null;
        }}
        to="/login"
      >
        login
      </NavLink>
      <NavLink
        style={({ isActive }) => {
          return isActive ? { background: "tomato",color:"#ffff" } : null;
        }}
        to="/signup"
      >
        signup
      </NavLink>
    </div>
  );
};
