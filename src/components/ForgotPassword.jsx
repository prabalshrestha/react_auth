import React from "react";
import { useState, useContext } from "react/cjs/react.development";
import Inputs from "./common/input";
import http from "../services/httpService";
import { NavLink, useNavigate } from "react-router-dom";
import validator from "validator";
import AuthContext from "../context/auth-context";

// const apiEndPoint = "http://192.168.49.2/api/";
const apiEndPoint = "http://localhost:8080/api/";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleEmail = (event) => {
    setEmail(event.target.value);
  };

  const validate = ({ email }) => {
    const err = {};
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
    };
    const err = validate(input);
    if (err) {
      setErrors(err || {});
      console.log("err");
      return;
    }
    try {
      const { data } = await http.put(
        apiEndPoint + "users/forgotPassword",
        input,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      setSuccess(true);
    } catch (error) {
      if (error.response && error.response.status >= 400) {
        const { data } = error.response;
        console.log(data);
        setErrors({ Invalid: data.error });
        return;
      }
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
                  <div className="d-flex align-items-center mb-3 pb-3">
                    <span className="h2 fw-bold mb-1">Forget Password ? </span>
                  </div>

                  {/* <h5
                    className="fw-normal  pb-2"
                    style={{ letterSpacing: "1px" }}
                  >
                    Reset password
                  </h5> */}
                  <div className="form-outline mb-3 pb-1">
                    <Inputs
                      label="Email"
                      value={email}
                      onChange={handleEmail}
                      type="text"
                      errors={errors.email}
                    />
                  </div>
                  {success && (
                    <div
                      data-testid="input-err-element"
                      className="alert alert-success py-2"
                    >
                      New password sent to your email
                    </div>
                  )}
                  {errors.Invalid && (
                    <div
                      data-testid="input-err-element"
                      className="alert alert-danger py-2"
                    >
                      {errors.Invalid}
                    </div>
                  )}
                  <div className="pt-1 mb-4">
                    <button type="submit" className="btn btn-primary">
                      Reset Password
                    </button>
                  </div>
                  <p className="mb-3 pb-lg-1" style={{ color: "#393f81" }}>
                    Reset successfull?{" "}
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

export default ForgotPassword;
