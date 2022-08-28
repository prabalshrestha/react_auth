import React from "react";

function TableList({ columns, userList }) {
  return (
    <React.Fragment>
      <div className="row ">
        <div className="col-10">
          <table className="table table-striped ">
            <thead>
              <tr>
                {columns.map((column) => (
                  <th key={column.name}>{column.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {userList.map((user) => (
                <tr key={user._id}>
                  <td key={user._id + user.name}>{user.name}</td>
                  <td key={user._id + user.email}>{user.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </React.Fragment>
  );
}

export default TableList;
