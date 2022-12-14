import { api } from "api/api";
import { CustomerEndPoints } from "../customerManager";

const getCustomers = (params) => {
  const url = CustomerEndPoints.CUSTOMER_MANAGER;
  return api.get(url, { params });
};
const createDetails = (data) => {
  const url = CustomerEndPoints.CUSTOMER_MANAGER;
  return api.post(url, data);
};
const getCustomerDetails = (id, params) => {
  const url = CustomerEndPoints.CUSTOMER_DETAIL.replace(
    ":customerId",
    id || ""
  );
  return api.get(url, { params });
};
const updateDetails = (id, data) => {
  const url = CustomerEndPoints.CUSTOMER_DETAIL.replace(
    ":customerId",
    id || ""
  );
  return api.put(url, data);
};
const deleteCustomer = (id) => {
  const url = CustomerEndPoints.CUSTOMER_DETAIL.replace(
    ":customerId",
    id || ""
  );
  return api.delete(url);
};

// debt
const getDebtCustomers = (params) => {
  const url = CustomerEndPoints.DEBT_MANAGER;
  return api.get(url, { params });
};
const getDeptCustomerDetails = (id) => {
  const url = CustomerEndPoints.DEBT_MANAGER_DETAILS.replace(":id", id);
  return api.get(url);
};
const createDeptCustomer = (data) => {
  const url = CustomerEndPoints.DEBT_MANAGER;
  console.log(data);
  return api.post(url, data);
};
const updateDeptCustomer = (id, data) => {
  const url = CustomerEndPoints.DEBT_MANAGER_DETAILS.replace(":id", id);
  return api.put(url, data);
};
const deleteDeptCustomer = (id) => {
  const url = CustomerEndPoints.DEBT_MANAGER_DETAILS.replace(":id", id);
  return api.delete(url);
};

const customerApi = {
  getCustomers,
  getCustomerDetails,
  createDetails,
  updateDetails,
  deleteCustomer,
  getDebtCustomers,
  getDeptCustomerDetails,
  deleteDeptCustomer,
  updateDeptCustomer,
  createDeptCustomer,
};
export default customerApi;
