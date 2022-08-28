import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserTable from "./UserTable";
import httpService from "../services/httpService";
import AuthContext from "../context/auth-context";
import Pagination from "./common/pagination";
import paginate from "../util/paginate";
import _ from "lodash";

// const apiEndpoint = "http://192.168.49.2/api/";
const apiEndpoint = "http://localhost:8080/api/";
const UsersList = () => {
  const [userList, setUserList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortColumn, setSortColumn] = useState({ path: "name", order: "asc" });
  const ctx = useContext(AuthContext);
  const navigate = useNavigate();
  useEffect(async () => {
    try {
      const { data } = await httpService.axios.get(apiEndpoint + "users", {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      setUserList([...data.users]);
    } catch (error) {
      if (error.response && error.response.status <= 400) {
        const { data } = error.response;
        console.log(data);
        // setErrors({ Invalid: data.error });
      }
    }
  }, []);
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handleSort = (sortColumn) => {
    setSortColumn(sortColumn);
  };
  const handleDelete = async (user) => {
    let body;
    try {
      const { data } = await httpService.delete(
        apiEndpoint + "users/" + user._id,
        {
          withCredentials: true,
        }
      );
      body = data;
    } catch (err) {
      if (err.response && err.response.status === 400) alert("Id not found");
    }
    const users = userList.filter((m) => m._id !== user._id);
    console.log(users);
    setUserList(users);
    console.log(users);
  };

  const filterData = () => {
    const filtered = userList;
    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
    const filteredData = paginate(sorted, currentPage, pageSize);
    return { totalCount: filtered.length, filteredData };
  };

  const { totalCount, filteredData } = filterData();
  return (
    <React.Fragment>
      <div className="container">
        <h1 className="">UserList List</h1>
        <button
          className="btn btn-primary mb-2 mt-2"
          onClick={() => {
            navigate("/registerUser");
          }}
        >
          Add User
        </button>
        <UserTable
          users={filteredData}
          sortColumn={sortColumn}
          onSort={handleSort}
          onDelete={handleDelete}
        />
        <Pagination
          itemsCount={totalCount}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={handlePageChange}
        />
      </div>
    </React.Fragment>
  );
};

export default UsersList;
