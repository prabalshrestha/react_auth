import React from "react";
import { Link, NavLink } from "react-router-dom";

function NavItem({ endpoint, title }) {
  return (
    <li className="nav-item">
      <NavLink className="nav-link" to={endpoint}>
        {title}
      </NavLink>
    </li>
  );
}

export default NavItem;
