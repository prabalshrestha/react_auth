import React, { useState } from "react";
import { Container } from "react-bootstrap";
import Inputs from "./common/input";
import Select from "react-select";
import ToggleEditInput from "./common/ToggleEditInput";

function PersonalDetail({
  name,
  email,
  selectedRoles,
  toggleEdit,
  handleName,
  handleEmail,
  handleEdit,
  handleSubmit,
  errors,
}) {
  return (
    <Container>
      <h3 className="fw-normal mb-3 pb-3" style={{ letterSpacing: "1px" }}>
        Personal Detail
      </h3>
      <div className="col-11">
        <form onSubmit={toggleEdit ? handleSubmit : handleEdit}>
          <div className="form-outline mb-4">
            <ToggleEditInput
              label="Username"
              value={name}
              onChange={handleName}
              type="text"
              errors={errors.name}
              disable={!toggleEdit}
            />
          </div>
          <div className="form-outline mb-4">
            <ToggleEditInput
              label="Email"
              value={email}
              onChange={handleEmail}
              type="text"
              errors={errors.email}
              disable={!toggleEdit}
            />
          </div>

          <div className="form-outline mb-4">
            <label>UserRoles</label>
            <Select
              options={selectedRoles}
              isMulti={true}
              value={selectedRoles}
              isDisabled={true}
            />
          </div>
          {toggleEdit ? (
            <div className="pt-1 mb-4">
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </div>
          ) : (
            <div className="pt-1 mb-4">
              <button type="submit" className="btn btn-primary">
                Edit
              </button>
            </div>
          )}
        </form>
      </div>
    </Container>
  );
}

export default PersonalDetail;
