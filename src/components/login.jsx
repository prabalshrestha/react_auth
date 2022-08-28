import React, { Component } from "react";
import { useContext, useState } from "react/cjs/react.development";
import Inputs from "./common/input";
import http from "../services/httpService";
import { NavLink, useNavigate } from "react-router-dom";
import AuthContext from "../context/auth-context";

// const apiEndpoint = "http://192.168.49.2/api/";
const apiEndpoint = "http://localhost:8080/api/";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const ctx = useContext(AuthContext);
  let navigate = useNavigate();

  const validate = ({ email, password }) => {
    const err = {};
    if (email.trim() === "") err.email = "Email is required";
    if (password.trim() === "") err.password = "Password is required";
    setErrors(err);
    return Object.keys(err).length === 0 ? null : err;
  };

  const handleEmail = (event) => {
    setEmail(event.target.value);
  };
  const handlePassword = (event) => {
    setPassword(event.target.value);
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    const input = {
      email: email,
      password: password,
    };
    const err = validate(input);
    if (err) {
      setErrors(err || {});
      console.log("err");
      return;
    }
    try {
      const { data } = await http.post(apiEndpoint + "users/login", input, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      ctx.onLogin(data.user);
      navigate(
        data.user.userRole.includes("student") ? "/home" : "/adminHome",
        {
          replace: true,
        }
      );
    } catch (error) {
      if (error.response && error.response.status <= 401) {
        const { data } = error.response;
        setErrors({ Invalid: data.error });
      }

      return;
    }
  };
  return (
    <section className="vh-100" style={{ backgroundColor: "#c6ecfd" }}>
      <div className="container  h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col col-xl-6">
            <div className="card" style={{ borderRadius: "1rem" }}>
              <div className="card-body p-4 p-lg-5 text-black">
                <form onSubmit={handleSubmit}>
                  <div className="d-flex align-items-center mb-3 pb-1">
                    <span className="h1 fw-bold mb-0">Intern </span>
                  </div>

                  <h5
                    className="fw-normal mb-3 pb-3"
                    style={{ letterSpacing: "1px" }}
                  >
                    Sign into your account
                  </h5>

                  <div className="form-outline mb-4">
                    <Inputs
                      label="Email"
                      value={email}
                      onChange={handleEmail}
                      type="text"
                      errors={errors.email}
                    />
                  </div>

                  <div className="form-outline mb-4">
                    <Inputs
                      label="Password"
                      value={password}
                      onChange={handlePassword}
                      type="password"
                      errors={errors.password}
                    />
                  </div>
                  {errors.Invalid && (
                    <div
                      data-testid="input-err-element"
                      className="alert alert-danger"
                    >
                      {errors.Invalid}
                    </div>
                  )}

                  <div className="pt-1 mb-4">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      style={{
                        backgroundColor: "#3394e1",
                        color: "#fff",
                        borderColor: "#3394e1",
                      }}
                    >
                      Submit
                    </button>
                  </div>

                  <p className="small text-muted">
                    <NavLink to="/forgotPassword" style={{ color: "#393f81" }}>
                      Forgot password ?
                    </NavLink>
                  </p>
                  <p className="mb-5 pb-lg-2" style={{ color: "#393f81" }}>
                    Don't have an account?{" "}
                    <NavLink to="/register" style={{ color: "#393f81" }}>
                      Register here
                    </NavLink>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
