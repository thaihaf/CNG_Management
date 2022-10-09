import { api } from "api/api";
import { EmployeeManagerPaths } from "../employeeManager";

const getEmployees = () => {
     const url = EmployeeManagerPaths.EMPLOYEE_LIST;
     return api.get(url);
};
const getEmployeeDetails = (id) => {
     const url = EmployeeManagerPaths.EMPLOYEE_DETAILS.replace(
          ":employeeId",
          id || ""
     );
     return api.get(url);
};
const employeeApi = { getEmployees, getEmployeeDetails };
export default employeeApi;
