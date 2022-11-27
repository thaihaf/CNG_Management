import { ProvincesEndPoint } from "../provinces";

const getProvinces = async () => {
     const url = ProvincesEndPoint.LIST_PROVINCES;
     return fetch(url).then((response) => response.json());
};
const getProvince = async (id) => {
     const url = ProvincesEndPoint.GET_PROVINCE.replace(":code", id || "");
     return fetch(url).then((response) => response.json());
};
const getDistrict = async (id) => {
     const url = ProvincesEndPoint.GET_DISTRICT.replace(":code", id || "");
     return fetch(url).then((response) => response.json());
};
const provincesApi = { getProvinces, getProvince, getDistrict };
export default provincesApi;
