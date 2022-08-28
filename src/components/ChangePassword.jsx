import React, { useState } from "react";
import { Container } from "react-bootstrap";
import Inputs from "./common/input";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import PasswordStrengthMeter from "./common/PasswordStrengthMeter";
import zxcvbn from "zxcvbn";
import http from "../services/httpService";
import RenderOptions from "./common/RenderOptions";
import Select from "react-select";

// const apiEndPoint = "http://192.168.49.2/api/";
const apiEndPoint = "http://localhost:8080/api/";

function ChangePassword() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState({});
  let params = useParams();

  const handleCurrentPassword = (event) => {
    setCurrentPassword(event.target.value);
  };
  const handleNewPassword = (event) => {
    setNewPassword(event.target.value);
  };
  const handleConfirmPassword = (event) => {
    setConfirmPassword(event.target.value);
  };

  const validate = ({ currentPassword, newPassword }) => {
    const err = {};
    const testResult = zxcvbn(newPassword);
    if (newPassword.trim() === "") err.newPassword = "Password is required";

    if (testResult.score < 4) {
      err.newPassword = "Password too weak";
    }
    if (newPassword === currentPassword) {
      err.newPassword = "Current password cant be your new password";
    }
    if (newPassword != confirmPassword) {
      err.confirmPassword = "Password doesnot match";
    }
    setErrors(err);
    return Object.keys(err).length === 0 ? null : err;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const input = {
      currentPassword: currentPassword,
      newPassword: newPassword,
    };
    const err = validate(input);
    if (err) {
      setErrors(err || {});
      return;
    }
    try {
      const { data } = await http.put(
        apiEndPoint + "users/changePassword/" + params.id,
        input,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      setSuccess(true);
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
    <Container>
      <h3 className="fw-normal mb-3 pb-3" style={{ letterSpacing: "1px" }}>
        Change Password
      </h3>
      <div className="col-9">
        <form onSubmit={handleSubmit}>
          <div className="form-outline mb-4">
            <Inputs
              label="Current Password"
              value={currentPassword}
              onChange={handleCurrentPassword}
              type="password"
              errors={errors.password}
            />
          </div>

          <div className="form-outline mb-4">
            <Inputs
              label="New Password"
              value={newPassword}
              onChange={handleNewPassword}
              type="password"
              errors={errors.newPassword}
            />
          </div>
          <PasswordStrengthMeter password={newPassword} />
          <div className="form-outline mb-4">
            <Inputs
              label="Confirm Password"
              value={confirmPassword}
              onChange={handleConfirmPassword}
              type="password"
              errors={errors.confirmPassword}
            />
          </div>
          {success && (
            <div
              data-testid="input-err-element"
              className="alert alert-success py-2"
            >
              Password successfully changed.
            </div>
          )}
          {errors.Invalid && (
            <div data-testid="input-err-element" className="alert alert-danger">
              {errors.Invalid}
            </div>
          )}
          <div className="pt-1 mb-4">
            <button type="submit" className="btn btn-primary">
              Submit
            </button>
          </div>
        </form>
      </div>
    </Container>
  );
}

export default ChangePassword;
