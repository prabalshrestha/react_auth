import React, { Component } from "react";
import { Link } from "react-router-dom";
import Table from "./common/table";

const UserTable = (props) => {
  const columns = [
    {
      path: "name",
      label: "Name",
      content: (user) => <Link to={`/user/${user._id}`}>{user.name}</Link>,
    },
    { path: "email", label: "Email" },
    {
      path: "userRole",
      label: "Roles",
      content: (user) => (
        <ul>
          {user.userRole.map((role) => (
            <li>{role}</li>
          ))}
        </ul>
      ),
    },
    {
      key: "delete",
      content: (user) => (
        <button
          onClick={() => {
            props.onDelete(user);
          }}
          className="btn btn-danger btn-sm"
        >
          delete
        </button>
      ),
    },
  ];
  const { users, sortColumn, onSort } = props;
  return (
    <Table
      data={users}
      sortColumn={sortColumn}
      onSort={onSort}
      columns={columns}
    />
  );
};

export default UserTable;
