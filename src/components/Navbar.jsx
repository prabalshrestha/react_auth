import React, { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import AuthContext from "../context/auth-context";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import NavItem from "./common/NavItem";
import logo from "../imgs/gs-lab-logo.png";

export default function NavBar(props) {
  const ctx = useContext(AuthContext);
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand>
          <Link
            className="navbar-brand"
            to={ctx.userRole.includes("student") ? "/" : "/"}
          >
            <img src={logo} style={{ width: "6rem", height: "2.5rem" }}></img>
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarNavDropdown" />
        <Navbar.Collapse id="navbarNavDropdown">
          <Nav>
            {ctx.isLoggedIn && !ctx.userRole.includes("student") && (
              <Nav.Link href="/studentList">Students</Nav.Link>
            )}

            {ctx.isLoggedIn && ctx.userRole.includes("admin") && (
              <Nav.Link href="/userList">Users</Nav.Link>
            )}
            {ctx.isLoggedIn && ctx.userRole.includes("admin") && (
              <Nav.Link href="/manageRoles">Roles</Nav.Link>
            )}
            {ctx.isLoggedIn && ctx.userRole.includes("admin") && (
              <Nav.Link href="/registerUser">Register User</Nav.Link>
            )}
          </Nav>

          <Nav className="ms-auto ">
            {ctx.isLoggedIn && (
              <NavDropdown
                title={ctx.activeUser.name + " "}
                id="basic-nav-dropdown"
              >
                <NavDropdown.Item href={"/profile/" + ctx.activeUser._id}>
                  Profile
                </NavDropdown.Item>
                <NavDropdown.Item>
                  <div onClick={ctx.onLogout}>Logout</div>
                </NavDropdown.Item>
              </NavDropdown>
            )}
            {!ctx.isLoggedIn && (
              <NavItem title="Login" endpoint="/login"></NavItem>
            )}
            {!ctx.isLoggedIn && (
              <li className="nav-item">
                <NavLink className="nav-link" to="/register">
                  Register
                </NavLink>
              </li>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
