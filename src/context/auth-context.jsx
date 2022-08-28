import { user } from "fontawesome";
import React, { useState, useEffect } from "react";
import useLocalStorage from "../hooks/useLocalStorage";
import http from "../services/httpService";
import { NavLink, useNavigate } from "react-router-dom";

const AuthContext = React.createContext({
  activeUser: {},
  isLoggedIn: false,
  userRole: [],
  onLogout: () => {},
  onLogin: (user) => {},
});
const apiEndpoint = "http://localhost:8080/api/";

export const AuthContextProvider = (props) => {
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage("isLoggedIn", false);
  const [activeUser, setActiveUser] = useState({});
  const [userRole, setUserRole] = useState([]);
  let navigate = useNavigate();

  // const [isLoggedIn, setIsLoggedIn] = useState(
  //   localStorage.getItem("IsLoggedIn")
  // );
  // const [activeUser, setActiveUser] = useState("");
  useEffect(async () => {
    if (isLoggedIn === true) {
      try {
        const { data } = await http.axios.get(apiEndpoint + "activeUser", {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });
        setActiveUser(data.user);
        setUserRole(data.user.userRole);
      } catch (error) {
        if (error.response && error.response.status >= 400) {
          const { data } = error.response;
          console.log("active user", data);
          alert(data.error);
          logoutHandler();
        }
      }
    }
  }, []);

  const logoutHandler = async () => {
    var navigateUrl = "";
    try {
      const { data } = await http.axios.post(apiEndpoint + "users/logout", {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      console.log(userRole);
      userRole.includes("student")
        ? (navigateUrl = "/login")
        : (navigateUrl = "/adminLogin");
    } catch (error) {
      if (error.response && error.response.status <= 400) {
        const { data } = error.response;
        console.log(data);
        alert(data.error);
      }
    }
    setIsLoggedIn(false);
    setActiveUser("");
    setUserRole([]);
    navigate(navigateUrl, { replace: true });
  };
  const loginHandler = (input) => {
    setIsLoggedIn(true);
    setActiveUser(input);
    setUserRole(input.userRole);
  };
  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: isLoggedIn,
        activeUser: activeUser,
        userRole: userRole,
        onLogin: loginHandler,
        onLogout: logoutHandler,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
