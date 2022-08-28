import React from "react";
import { useState, useContext, useEffect } from "react/cjs/react.development";
import Inputs from "./common/input";
import http from "../services/httpService";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import validator from "validator";
import { Nav, Tab, Col, Row, Container } from "react-bootstrap";
// import AuthContext from "../context/auth-context";
import zxcvbn from "zxcvbn";
import RenderOptions from "./common/RenderOptions";
import Select from "react-select";
import StudentHome from "./StudentHome";
import ChangePassword from "./ChangePassword";
import PersonalDetail from "./PersonalDetail";

// const apiEndPoint = "http://192.168.49.2/api/";
const apiEndPoint = "http://localhost:8080/api/";

export default function Profile() {
  const [genreLoaded, setGenreLoaded] = useState(false);
  const [name, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [roles, setRoles] = useState([]);

  // dropdown checkbox
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState([]);

  // const ctx = useContext(AuthContext);
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
        setUsername(user.name);
        let newRoles = [...options];

        let selected = [];
        newRoles.map((option) => {
          if (user.userRole.includes(option.value)) {
            console.log("trueee");
            selected.push(option);
          }
        });
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
    setUsername(event.target.value);
  };
  const handleEmail = (event) => {
    setEmail(event.target.value);
  };
  const [toggleEdit, setToggleEdit] = useState(false);
  const handleEdit = (event) => {
    event.preventDefault();
    setToggleEdit(true);
  };

  const validate = ({ name, password, email }) => {
    const err = {};
    if (name.trim() === "") err.name = "Username is required";
    if (email.trim() === "") err.email = "Email is required";

    if (!validator.isEmail(email)) {
      err.email = "Enter valid Email!";
    }
    setErrors(err);
    return Object.keys(err).length === 0 ? null : err;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const input = {
      email: email,
      name: name,
    };
    const err = validate(input);
    if (err) {
      setErrors(err || {});
      console.log("err");
      return;
    }
    try {
      const { data } = await http.put(
        apiEndPoint + "users/" + params.id,
        input,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      setToggleEdit(false);
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
    <Container className="py-2">
      <h1>Profile</h1>
      <Tab.Container id="left-tabs-example" defaultActiveKey="first">
        <Row>
          <Col sm={2}>
            <Nav variant="pills" className="flex-column">
              <Nav.Item>
                <Nav.Link eventKey="first">Personal Details</Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="second">Change Password</Nav.Link>
              </Nav.Item>
            </Nav>
          </Col>
          <Col sm={8}>
            <Tab.Content>
              <Tab.Pane eventKey="first">
                <PersonalDetail
                  name={name}
                  email={email}
                  selectedRoles={selectedOption}
                  toggleEdit={toggleEdit}
                  handleName={handleName}
                  handleEmail={handleEmail}
                  handleEdit={handleEdit}
                  handleSubmit={handleSubmit}
                  errors={errors}
                />
              </Tab.Pane>
              <Tab.Pane eventKey="second">
                <ChangePassword />
              </Tab.Pane>
            </Tab.Content>
          </Col>
        </Row>
      </Tab.Container>
    </Container>
  );
}
