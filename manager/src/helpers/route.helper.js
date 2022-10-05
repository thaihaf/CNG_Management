export function flatten(items) {
  const flat= [];

  items.forEach(item => {
    if (Array.isArray(item.nestedRoutes)) {
      flat.push(...flatten(item.nestedRoutes));
    } else {
      flat.push(item);
    }
  });

  return flat;
}