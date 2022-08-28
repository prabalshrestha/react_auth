import React from "react";
import { useState, useContext } from "react/cjs/react.development";
import Inputs from "./common/input";
import http from "../services/httpService";
import { NavLink, useNavigate } from "react-router-dom";
import validator from "validator";
import AuthContext from "../context/auth-context";
import PasswordStrengthMeter from "./common/PasswordStrengthMeter";
import zxcvbn from "zxcvbn";

// const apiEndPoint = "http://192.168.49.2/api/";

const apiEndPoint = "http://localhost:8080/api/";

export default function Register() {
  const [name, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const ctx = useContext(AuthContext);

  let navigate = useNavigate();

  const validate = ({ name, password, email }) => {
    const err = {};
    const testResult = zxcvbn(password);
    if (name.trim() === "") err.name = "Username is required";
    if (password.trim() === "") err.password = "Password is required";
    if (email.trim() === "") err.email = "Email is required";

    if (!validator.isEmail(email)) {
      err.email = "Enter valid Email!";
    }
    if (testResult.score < 4) {
      err.password = "Password too weak";
    }
    setErrors(err);
    return Object.keys(err).length === 0 ? null : err;
  };

  const handleUsername = (event) => {
    setUsername(event.target.value);
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
      name: name,
      password: password,
    };
    const err = validate(input);
    if (err) {
      setErrors(err || {});
      console.log("err");
      return;
    }
    try {
      const { data } = await http.post(apiEndPoint + "students/signup", input, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      ctx.onLogin(data.user.userId);
      navigate("/home");
    } catch (error) {
      if (error.response && error.response.status <= 400) {
        const { data } = error.response;
        console.log(data);
        setErrors({ Invalid: data.error });
        return;
      }
    }

    // navigate("/home");
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
                    Register a new account
                  </h5>

                  <div className="form-outline mb-4">
                    <Inputs
                      label="Username"
                      value={name}
                      onChange={handleUsername}
                      type="text"
                      errors={errors.name}
                    />
                  </div>
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
                  <PasswordStrengthMeter password={password} />
                  <div className="pt-1 mb-4">
                    <button type="submit" className="btn btn-primary">
                      Submit
                    </button>
                  </div>
                  <p className="mb-5 pb-lg-2" style={{ color: "#393f81" }}>
                    Already have an account?{" "}
                    <NavLink to="/login" style={{ color: "#393f81" }}>
                      Login here
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
}
