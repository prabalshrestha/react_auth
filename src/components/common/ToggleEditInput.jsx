import React from "react";

const ToggleEditInput = ({ label, value, onChange, type, errors, disable }) => {
  return (
    <div className="form-group">
      <label htmlFor={value}>{label}</label>
      <input
        value={value}
        onChange={onChange}
        id={label}
        type={type}
        className="form-control"
        disabled={disable}
      />
      {errors && (
        <div data-testid="input-err-element" className="alert alert-danger">
          {errors}
        </div>
      )}
    </div>
  );
};

export default ToggleEditInput;
