import React from "react";
import { useState, useContext, useEffect } from "react/cjs/react.development";
import Inputs from "./common/input";
import http from "../services/httpService";
import { NavLink, useNavigate } from "react-router-dom";
import validator from "validator";
import AuthContext from "../context/auth-context";
import PasswordStrengthMeter from "./common/PasswordStrengthMeter";
import zxcvbn from "zxcvbn";
import Select from "react-select";

// const apiEndPoint = "http://192.168.49.2/api/";

const apiEndPoint = "http://localhost:8080/api/";
export default function RegisterUser() {
  const [genreLoaded, setGenreLoaded] = useState(false);
  const [name, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [roles, setRoles] = useState([]);
  // dropdown checkbox
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState([]);
  // const ctx = useContext(AuthContext);

  let navigate = useNavigate();
  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await http.get(apiEndPoint + "roles", {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });
        const roles = data.roles;
        setRoles([...data.roles]);
        setGenreLoaded(true);
      } catch (error) {
        if (error.response && error.response.status <= 400) {
          const { data } = error.response;
          console.log(data);
          return;
        }
        console.log(error);
      }
    }
    fetchData();
  }, []);
  useEffect(() => {
    let optionList = [];
    roles.map((role) => {
      const option = { value: role.name, label: role.name };
      optionList.push(option);
    });
    setOptions(optionList);
  }, [genreLoaded]);

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
    if (password != confirmPassword) {
      err.confirmPassword = "Password doesnot match";
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
  const handleConfirmPassword = (event) => {
    setConfirmPassword(event.target.value);
  };
  const handleChange = (selected) => {
    setSelectedOption(selected);
    console.log("Onchange", selected);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let userRole = [];
    selectedOption.map((role) => {
      userRole.push(role.value);
    });
    event.preventDefault();
    const input = {
      email: email,
      name: name,
      userRole: userRole,
      password: password,
    };
    const err = validate(input);
    if (err) {
      setErrors(err || {});
      console.log("err");
      return;
    }
    console.log("ON Submit : input", input);
    try {
      const { data } = await http.post(apiEndPoint + "users/register", input, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      navigate("/adminHome");
    } catch (error) {
      if (error.response && error.response.status <= 400) {
        const { data } = error.response;
        console.log(data);
        setErrors({ Invalid: data.error });
        return;
      }
    }
  };
  return (
    <section className="vh-100" style={{ backgroundColor: "#a4a4a7" }}>
      <div className="container  h-100">
        <div className="row d-flex justify-content-center align-items-center h-100">
          <div className="col col-xl-6">
            <div className="card" style={{ borderRadius: "1rem" }}>
              <div className="card-body p-4 p-lg-5 text-black">
                <form onSubmit={handleSubmit}>
                  <div className="d-flex align-items-center mb-3 pb-1">
                    <span className="h1 fw-bold mb-0">Register </span>
                  </div>

                  {/* <h5
                    className="fw-normal mb-3 pb-3"
                    style={{ letterSpacing: "1px" }}
                  >
                    Add a new user
                  </h5> */}

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
                    <label>UserRoles</label>
                    <Select
                      onChange={handleChange}
                      options={options}
                      isMulti={true}
                      value={selectedOption}
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
                  <div className="form-outline mb-4">
                    <Inputs
                      label="Confirm Password"
                      value={confirmPassword}
                      onChange={handleConfirmPassword}
                      type="password"
                      errors={errors.confirmPassword}
                    />
                  </div>
                  <div className="pt-1 mb-4">
                    <button type="submit" className="btn btn-primary">
                      Submit
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
