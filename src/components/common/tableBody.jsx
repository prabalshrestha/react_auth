import React, { Component } from "react";
import _ from "lodash";
const TableBody = (props) => {
  const renderCell = (item, column) => {
    if (column.content) return column.content(item);
    return _.get(item, column.path);
  };
  const { data, columns } = props;
  return (
    <tbody>
      {data.map((item) => (
        <tr className="" key={item._id}>
          {columns.map((column) => (
            <td
              className={column.key === "delete" ? "text-end  " : ""}
              key={item._id + (column.path || column.key)}
            >
              {renderCell(item, column)}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
};

export default TableBody;
