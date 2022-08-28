import React, { Component } from "react";
import { Link } from "react-router-dom";
import Table from "./common/table";

const RoleTable = (props) => {
  const columns = [
    {
      path: "name",
      label: "Role",
    },
    {
      key: "delete",
      content: (role) => (
        <button
          onClick={() => {
            props.onDelete(role);
          }}
          className="btn btn-danger btn-sm"
        >
          delete
        </button>
      ),
    },
  ];
  const { roles, sortColumn, onSort } = props;
  return (
    <Table
      data={roles}
      sortColumn={sortColumn}
      onSort={onSort}
      columns={columns}
    />
  );
};

export default RoleTable;
