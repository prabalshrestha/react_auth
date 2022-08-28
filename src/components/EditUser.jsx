import React from "react";
import { useState, useContext, useEffect } from "react/cjs/react.development";
import Inputs from "./common/input";
import http from "../services/httpService";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import validator from "validator";
import AuthContext from "../context/auth-context";
import zxcvbn from "zxcvbn";
import RenderOptions from "./common/RenderOptions";
import Select from "react-select";

// const apiEndPoint = "http://192.168.49.2/api/";
const apiEndPoint = "http://localhost:8080/api/";

export default function EditUser() {
  const [genreLoaded, setGenreLoaded] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [roles, setRoles] = useState([]);

  // dropdown checkbox
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState([]);

  const ctx = useContext(AuthContext);
  let params = useParams();
  const navigate = useNavigate();

  useEffect(() => {}, [genreLoaded]);

  // fetch genre
  useEffect(async () => {
    async function fetchGenres() {
      try {
        const { data } = await http.get(apiEndPoint + "roles", {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });
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
    fetchGenres();
  }, []);

  useEffect(() => {
    let optionList = [];
    roles.map((role) => {
      const option = { value: role.name, label: role.name };
      optionList.push(option);
    });
    setOptions(optionList);
  }, [genreLoaded]);
  // fetch USER data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await http.get(apiEndPoint + "users/" + params.id, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });
        const user = data.user;
        setEmail(user.email);
        setName(user.name);
        setPassword(user.password);
        let newRoles = [...options];

        let selected = [];
        newRoles.map((option) => {
          if (user.userRole.includes(option.value)) {
            console.log("trueee");
            selected.push(option);
          }
        });
        // console.log(selected);
        setSelectedOption(selected);
      } catch (error) {
        if (error.response && error.response.status <= 400) {
          const { data } = error.response;
          console.log(data);
          return;
        }
        console.log(error);
      }
    };
    fetchUserData();
  }, [options]);

  const handleName = (event) => {
    setName(event.target.value);
  };
  const handleEmail = (event) => {
    setEmail(event.target.value);
  };

  const handleChange = (selected) => {
    setSelectedOption(selected);
    console.log("Onchange", selected);
  };

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
    console.log(input);
    try {
      const { data } = await http.put(
        apiEndPoint + "users/" + params.id,
        input,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
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
                  <h3
                    className="fw-normal mb-3 pb-3"
                    style={{ letterSpacing: "1px" }}
                  >
                    Modify User
                  </h3>

                  <div className="form-outline mb-4">
                    <Inputs
                      label="Username"
                      value={name}
                      onChange={handleName}
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
                      isSearchable={true}
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
