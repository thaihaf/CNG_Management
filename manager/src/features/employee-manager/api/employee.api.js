import { api } from "api/api";
import { EmployeeEndPoints } from "../employeeManager";

const getEmployees = () => {
     const url = EmployeeEndPoints.EMPLOYEE_MANAGER;
     return api.get(url);
};
const createAccEmployee = (data) => {
     const url = EmployeeEndPoints.CREATE_EMPLOYEE;
     return api.post(url, data);
};
const getEmployeeDetails = (id) => {
     const url = EmployeeEndPoints.EMPLOYEE_DETAILS.replace(
          ":employeeId",
          id || ""
     );
     return api.get(url);
};
const employeeApi = { getEmployees, getEmployeeDetails, createAccEmployee };
export default employeeApi;
