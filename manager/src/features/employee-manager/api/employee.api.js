import { api } from "api/api";
import { EmployeeEndPoints } from "../employeeManager";

const getEmployees = () => {
     const url = EmployeeEndPoints.EMPLOYEE_MANAGER;
     return api.get(url);
};
const createDetails = (data) => {
     const url = EmployeeEndPoints.EMPLOYEE_MANAGER;
     return api.post(url, data);
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
const updateDetails = (id, data) => {
     const url = EmployeeEndPoints.EMPLOYEE_DETAILS.replace(
          ":employeeId",
          id || ""
     );
     return api.put(url, data);
};
const getAccounts = () => {
	const url = EmployeeEndPoints.ACCOUNT_MANAGER;
	return api.get(url);
};
const deleteEmployee = (id) => {
		 const url = EmployeeEndPoints.EMPLOYEE_DETAILS.replace(
					":employeeId",
					id || ""
		 );
		 return api.delete(url);
};

const employeeApi = {
     getEmployees,
     getEmployeeDetails,
     createAccEmployee,
     createDetails,
     updateDetails,
		 getAccounts,
		 deleteEmployee
};
export default employeeApi;
