import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import paginate from "../util/paginate";
import _ from "lodash";
import httpService from "../services/httpService";
import AuthContext from "../context/auth-context";
import Pagination from "./common/pagination";
import StudentTable from "./StudentTable";

// const apiEndpoint = "http://192.168.49.2/api/";
const apiEndpoint = "http://localhost:8080/api/";

const StudentList = () => {
  const [studentList, setStudentList] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [sortColumn, setSortColumn] = useState({ path: "name", order: "asc" });
  const ctx = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(async () => {
    try {
      const { data } = await httpService.axios.get(apiEndpoint + "students", {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });
      console.log(data);
      setStudentList([...data.users]);
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

  const handleDelete = async (student) => {
    try {
      const { data } = await httpService.delete(
        apiEndpoint + "users/" + student._id,
        {
          withCredentials: true,
        }
      );
      const students = studentList.filter((m) => m._id !== student._id);
      console.log(students);
      setStudentList(students);
      console.log(students);
    } catch (err) {
      if (err.response && err.response.status >= 400) alert("Id not found");
    }
  };

  const filterData = () => {
    const filtered = studentList;
    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
    const filteredData = paginate(sorted, currentPage, pageSize);
    return { totalCount: filtered.length, filteredData };
  };

  const { totalCount, filteredData } = filterData();

  return (
    <div className="container">
      {console.log("pageRender")}
      <h1 className="">Student List</h1>
      {ctx.userRole.includes("admin") && (
        <button
          className="btn btn-primary mb-2 mt-2"
          onClick={() => {
            navigate("/registerUser");
          }}
        >
          Add Student
        </button>
      )}
      <StudentTable
        students={filteredData}
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
};

export default StudentList;
