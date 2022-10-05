import camelCase from "lodash.camelcase";

export const isArray = (d) => Array.isArray(d);
export const isObject = (d) =>
  d === Object(d) && !isArray(d) && typeof d !== "function";

const toCamelCase = (d) => {
  if (isObject(d)) {
    const o = {};
    Object.keys(d).forEach(k => {
      o[camelCase(k)] = toCamelCase(d[k]);
    });

    return o;
  }
  if (isArray(d)) {
    return d.map((o) => toCamelCase(o));
  }

  return d;
};

export default toCamelCase;