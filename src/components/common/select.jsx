import React from "react";

const RenderSelect = ({ label, options, onChange, value, errors }) => {
  return (
    <div className="form-group">
      <label htmlFor={value}>{label}</label>
      <br></br>
      <select value={value} onChange={onChange}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
      {errors && (
        <div data-testid="input-err-element" className="alert alert-danger">
          {errors}
        </div>
      )}
    </div>
  );
};

export default RenderSelect;
