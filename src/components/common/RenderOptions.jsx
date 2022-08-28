import { check } from "fontawesome";
import React from "react";
function RenderOptions({ options, onChange, label }) {
  return (
    <div className="form-group ">
      <label>{label}</label>
      <br></br>

      {options.map((option) => (
        <div className="form-check form-check-inline" key={option.name}>
          <input
            className="form-check-input"
            type="checkbox"
            onChange={() => onChange(option)}
            checked={option.selected}
          ></input>
          <label>{option.name}</label>
        </div>
      ))}
    </div>
  );
}

export default RenderOptions;
