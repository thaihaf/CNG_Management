import snakeCase from "lodash.snakecase";

const isArray = (d) => Array.isArray(d);
const isObject = (d) =>
  d === Object(d) && !isArray(d) && typeof d !== "function";

const toSnakeCase = (d) => {
  if (isObject(d)) {
    const o = {};
    Object.keys(d).forEach(k => {
      o[snakeCase(k)] = toSnakeCase(d[k]);
    });

    return o;
  }
  if (isArray(d)) {
    return d.map((o) => toSnakeCase(o));
  }

  return d;
};

export default toSnakeCase;