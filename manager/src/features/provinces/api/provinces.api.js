import { api } from "api/api";
import { ProvincesEndPoint } from "../provinces";

const getProvinces = () => {
     const url = ProvincesEndPoint.LIST_PROVINCES;
     return api.get(url);
};
const getProvince = (id) => {
     const url = ProvincesEndPoint.GET_PROVINCE.replace(":code", id || "");
     return api.get(url);
};
const getDistrict = (id) => {
     const url = ProvincesEndPoint.GET_DISTRICT.replace(":code", id || "");
     return api.get(url);
};
const provincesApi = { getProvinces, getProvince, getDistrict };
export default provincesApi;
