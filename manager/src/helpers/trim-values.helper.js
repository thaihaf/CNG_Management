import get from "lodash.get";

import {isArray, isObject } from "./toCamelCase.helper";

export function trimValue(d) {
     if (typeof d === "string") {
          return d.trim();
     }

     if (isObject(d)) {
          const o = {};
          Object.keys(d).forEach((k) => {
               o[k] = trimValue(get(d, k));
          });

          return o;
     }

     if (isArray(d)) {
          return d.map((i) => trimValue(i));
     }

     return d;
}
