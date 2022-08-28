import React, { Component, useContext } from "react";
import { Link } from "react-router-dom";
import AuthContext from "../context/auth-context";
import Table from "./common/table";

const StudentTable = (props) => {
  const ctx = useContext(AuthContext);
  const columns = [
    {
      path: "name",
      label: "Name",
      content: (student) =>
        ctx.userRole.includes("admin") ? (
          <Link to={`/user/${student._id}`}>{student.name}</Link>
        ) : (
          student.name
        ),
    },
    { path: "email", label: "Email" },
    { path: "userRole", label: "Roles" },
    ctx.userRole.includes("admin") && {
      key: "delete",
      content: (movie) => (
        <button
          onClick={() => {
            props.onDelete(movie);
          }}
          className="btn btn-danger btn-sm"
        >
          delete
        </button>
      ),
    },
  ];
  const { students, sortColumn, onSort } = props;
  return (
    <Table
      data={students}
      sortColumn={sortColumn}
      onSort={onSort}
      columns={columns}
    />
  );
};

export default StudentTable;
