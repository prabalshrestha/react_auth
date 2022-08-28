import React, { useState, useEffect, useContext } from "react";
import http from "../services/httpService";
import Inputs from "./common/input";
import TableList from "./common/TableList";
import { useNavigate } from "react-router-dom";
import httpService from "../services/httpService";
import AuthContext from "../context/auth-context";
import Pagination from "./common/pagination";
import paginate from "../util/paginate";
import _ from "lodash";
import RoleTable from "./RoleTable";

// const apiEndPoint = "http://192.168.49.2/api/";
const apiEndpoint = "http://localhost:8080/api/";
function ManageRoles() {
  const [role, setRole] = useState("");
  const [roles, setRoles] = useState([]);
  const [addUserToggle, setAddUserToggle] = useState(false);
  const [errors, setErrors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortColumn, setSortColumn] = useState({ path: "name", order: "asc" });
  const ctx = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await http.get(apiEndpoint + "roles", {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });
        const roles = data.roles;
        setRoles([...data.roles]);
      } catch (error) {
        if (error.response && error.response.status <= 400) {
          const { data } = error.response;
          console.log(data);
          return;
        }
        console.log(error);
      }
    }
    fetchData();
  }, []);
  const handleAddUser = () => {
    async function postData() {
      const input = { name: role };
      if (role === "") return;
      try {
        const { data } = await http.post(apiEndpoint + "roles", input, {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        });
        const newRoles = [...roles];
        newRoles.push(data.role);
        setRoles(newRoles);
        setRole("");
      } catch (error) {
        if (error.response && error.response.status <= 400) {
          const { data } = error.response;
          console.log(data);
          return;
        }
        console.log(error);
      }
    }
    postData();

    setAddUserToggle(false);
  };

  const handleRole = (event) => {
    setRole(event.target.value);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };
  const handleSort = (sortColumn) => {
    setSortColumn(sortColumn);
  };
  const handleDelete = async (role) => {
    let body;
    try {
      const { data } = await httpService.delete(
        apiEndpoint + "roles/" + role._id,
        {
          withCredentials: true,
        }
      );
      body = data;
    } catch (err) {
      if (err.response && err.response.status === 400) alert("Id not found");
    }
    const rolesList = roles.filter((m) => m._id !== role._id);
    console.log(rolesList);
    setRoles(rolesList);
    console.log(rolesList);
  };

  const filterData = () => {
    const filtered = roles;
    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
    const filteredData = paginate(sorted, currentPage, pageSize);
    return { totalCount: filtered.length, filteredData };
  };

  const { totalCount, filteredData } = filterData();

  return (
    <div className="container">
      <h1>ManageRoles</h1>
      <button
        className="btn btn-primary mb-2 mt-2"
        onClick={() => {
          addUserToggle ? handleAddUser() : setAddUserToggle(true);
        }}
      >
        Add Role
      </button>
      {addUserToggle && (
        <Inputs
          label="Role"
          value={role}
          onChange={handleRole}
          type="text"
          errors={errors.email}
        />
      )}
      <RoleTable
        roles={filteredData}
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
  );
}

export default ManageRoles;
