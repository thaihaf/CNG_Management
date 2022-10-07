import filter from "lodash.filter";
import forEach from "lodash.foreach";
import get from "lodash.get";
import isEmpty from "lodash.isempty";
import startsWith from "lodash.startswith";

/**
 * Check if a string looks like an external URL
 */
export const isURL = (str) => {
     return /http|www/.test(str);
};

/**
 * A promise to delay an async function
 * @param ms how many milliseconds to wait
 */
export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const getInitials = (name, maxChar) => {
     return name
          .split(/\s/)
          .map((word) => word[0])
          .join("")
          .substr(0, maxChar)
          .toUpperCase();
};

export const getMessage = (code, listMess, nameField, limit) => {
     if (!code) {
          return "";
     }
     let mess = get(listMess, code);
     if (nameField) {
          mess = mess.replace("%field%", nameField);
     }
     if (limit) {
          mess = mess.replace("%limit%", limit);
     }
     return mess;
};

export const setMenuActive = (arrPath, path) => {
     if (isEmpty(arrPath)) {
          return false;
     }
     const isMenu = filter(arrPath, (pathItem) => {
          return startsWith(path, pathItem);
     });
     return !isEmpty(isMenu);
};

export const toNullValue = (data) => {
     const dataNull = {};
     const t = data;
     forEach(t, (item, key) => {
          if (item === "") {
               dataNull[key] = null;
          }
     });

     const d = {
          ...data,
          ...dataNull,
     };
     return d;
};

export const checkTimeNotice = (fromTime, toTime) => {
     if ((!fromTime && toTime) || (fromTime && !toTime)) {
          return false;
     }

     if ((fromTime && toTime) || (!fromTime && !toTime)) {
          return true;
     }

     return true;
};

export const replaceString = (stringReplace, from, to) => {
     return `${stringReplace.slice(0, from)}${"*".repeat(
          stringReplace.length - (from + to)
     )}${stringReplace.slice(-to)}`;
};

