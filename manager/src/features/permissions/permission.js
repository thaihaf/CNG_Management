import { PermissionScope } from "./contansts/permissions.scopes";

export { default as Permission } from "./components/Permission/Permission";
export { default as usePermissions } from "./hooks/permissions.hook";
export * from "./redux/permissions.slice";

export { PermissionScope };