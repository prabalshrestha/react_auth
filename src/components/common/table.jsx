import React from "react";
import TableBody from "./tableBody";
import TableHeader from "./tableHeader";
const Table = (props) => {
  const { data, sortColumn, onSort, columns } = props;
  return (
    <table className="table ">
      <TableHeader columns={columns} sortColumn={sortColumn} onSort={onSort} />
      <TableBody columns={columns} data={data} />
    </table>
  );
};

export default Table;
