import React from "react";

const Inputs = ({ label, value, onChange, type, errors }) => {
  return (
    <div className="form-group">
      <label htmlFor={value}>{label}</label>
      <input
        value={value}
        onChange={onChange}
        id={label}
        type={type}
        className="form-control"
      />
      {errors && (
        <div data-testid="input-err-element" className="alert alert-danger">
          {errors}
        </div>
      )}
    </div>
  );
};

export default Inputs;
