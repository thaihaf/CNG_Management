import { api } from "api/api";
import { CustomerEndPoints } from "../customerManager";

const getCustomers = () => {
  const url = CustomerEndPoints.CUSTOMER_MANAGER;
  return api.get(url);
};
const createDetails = (data) => {
  const url = CustomerEndPoints.CUSTOMER_MANAGER;
  return api.post(url, data);
};
const getCustomerDetails = (id) => {
  const url = CustomerEndPoints.CUSTOMER_DETAIL.replace(
    ":customerId",
    id || ""
  );
  return api.get(url);
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
const customerApi = {
  getCustomers,
  getCustomerDetails,
  createDetails,
  updateDetails,
  deleteCustomer,
};
export default customerApi;
