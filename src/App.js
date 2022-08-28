import { Route, Routes } from "react-router-dom";
import "./App.css";
import NotFound from "./components/notFound";
import NavBar from "./components/Navbar";
import React,{useContext} from "react";
import Login from "./components/login";
import Register from "./components/register";
import AuthContext from "./context/auth-context";
import StudentHome from "./components/StudentHome";
import AdminLogin from "./components/admin";
import RegisterUser from "./components/RegisterUser";
import AdminHome from "./components/AdminHome";
import UsersList from "./components/UserList";
import StudentTable from "./components/StudentList";
import EditUser from "./components/EditUser";
import ManageRoles from "./components/ManageRoles";
import ForgotPassword from "./components/ForgotPassword";
import Profile from "./components/Profile";

function App() {
  const ctx=useContext(AuthContext)
  
  return (
    <React.Fragment>
      <NavBar />
      <main>
        <Routes>
          <Route path="/login" element={<Login/>}></Route>
          <Route path="/adminLogin" element={<AdminLogin/>}></Route>
          <Route path="/forgotPassword" element={<ForgotPassword/>}></Route>
          <Route path="/adminHome" element={(ctx.userRole==="student")?<NotFound/>:<AdminHome/>}></Route>
          <Route path="/userList" element={(ctx.userRole).includes("admin")?<UsersList/>:<NotFound/>}></Route>
          <Route path="/studentList" element={!(ctx.userRole).includes("student")?<StudentTable/>:<NotFound/>}></Route>
          <Route path="/user/:id" element={(ctx.userRole).includes("admin")?<EditUser/>:<NotFound/>}></Route>
          <Route path="/manageRoles" element={(ctx.userRole).includes("admin")?<ManageRoles/>:<NotFound/>}></Route>
          <Route path="/home" element={<StudentHome/>}></Route>
          <Route path="/profile/:id" element={<Profile/>}></Route>
          <Route path="/register" element={<Register/>}></Route>
          <Route path="/registerUser" element={(ctx.userRole==="student")?<NotFound/>:<RegisterUser/>}></Route>
          <Route path="/*" element={<NotFound/>}></Route>
          <Route index element={(ctx.isLoggedIn===true)?(ctx.userRole.includes("student")?<StudentHome/>:<AdminHome/>):<Login/>}></Route>
        </Routes>
      </main>
      </React.Fragment>
  );
}

export default App;
