import React from "react";
import {
     TeamOutlined,
     FileDoneOutlined,
     ReconciliationOutlined,
} from "@ant-design/icons/";

export const siderBarItems = [
     {
          key: "product",
          icon: <TeamOutlined style={{ fontSize: "1.6rem" }} />,
          label: `Product`,
          role: ["admin", "employee"],
     },
     {
          key: "brand",
          icon: <TeamOutlined style={{ fontSize: "1.6rem" }} />,
          label: `Brand`,
          role: ["admin", "employee"],
     },
     {
          key: "accounts",
          icon: <TeamOutlined style={{ fontSize: "1.6rem" }} />,
          label: `Account`,
          role: ["admin"],
     },
     {
          key: "employee",
          icon: <TeamOutlined style={{ fontSize: "1.6rem" }} />,
          label: `Employee`,
          role: ["admin"],
     },
     {
          key: "supplier",
          icon: <FileDoneOutlined style={{ fontSize: "1.6rem" }} />,
          label: `Supplier`,
          role: ["admin", "employee"],
     },
     {
          key: "customer",
          icon: <ReconciliationOutlined style={{ fontSize: "1.6rem" }} />,
          label: `Customer`,
          role: ["admin", "employee"],
     },
     //
     {
          key: "profile",
          icon: <ReconciliationOutlined style={{ fontSize: "1.6rem" }} />,
          label: `Profile`,
          role: ["employee"],
     },
     {
          key: "settings",
          icon: <ReconciliationOutlined style={{ fontSize: "1.6rem" }} />,
          label: `Settings`,
          role: ["admin", "employee"],
     },
     {
          key: "warehouse",
          icon: <ReconciliationOutlined style={{ fontSize: "1.6rem" }} />,
          label: `Warehouse`,
          role: ["admin", "employee"],
     },
];
