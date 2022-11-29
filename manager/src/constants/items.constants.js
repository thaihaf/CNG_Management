import React from "react";
import {
     TeamOutlined,
     FileDoneOutlined,
     ReconciliationOutlined,
     AppstoreOutlined,
     ContactsOutlined,
     DatabaseOutlined,
     TagOutlined,
     UserOutlined,
     UserAddOutlined,
     InboxOutlined,
     ImportOutlined,
     DashboardOutlined,
     ExportOutlined,
} from "@ant-design/icons/";

export const siderBarItems = [
     {
          key: "dashboard",
          icon: <DashboardOutlined style={{ fontSize: "1.6rem" }} />,
          label: `Dashboard`,
          role: ["admin", "employee"],
     },
     {
          key: "product",
          icon: <InboxOutlined style={{ fontSize: "1.6rem" }} />,
          label: `Products`,
          role: ["admin", "employee"],
     },
     {
          key: "import-product",
          icon: <ImportOutlined style={{ fontSize: "1.6rem" }} />,
          label: `Import Product`,
          role: ["admin", "employee"],
     },
     {
          key: "export-product",
          icon: <ExportOutlined style={{ fontSize: "1.6rem" }} />,
          label: `Export Product`,
          role: ["admin", "employee"],
     },
     {
          key: "brand",
          icon: <TagOutlined style={{ fontSize: "1.6rem" }} />,
          label: `Brands`,
          role: ["admin", "employee"],
     },
     {
          key: "accounts",
          icon: <UserAddOutlined style={{ fontSize: "1.6rem" }} />,
          label: `Accounts`,
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
          icon: <ContactsOutlined style={{ fontSize: "1.6rem" }} />,
          label: `Suppliers`,
          role: ["admin", "employee"],
     },
     {
          key: "customer",
          icon: <UserOutlined style={{ fontSize: "1.6rem" }} />,
          label: `Customers`,
          role: ["admin", "employee"],
     },
     {
          key: "warehouse",
          icon: <DatabaseOutlined style={{ fontSize: "1.6rem" }} />,
          label: `Warehouse`,
          role: ["admin", "employee"],
     },
     {
          key: "category",
          icon: <AppstoreOutlined style={{ fontSize: "1.6rem" }} />,
          label: `Categories`,
          role: ["admin", "employee"],
     },
     //
     {
          key: "profile",
          icon: <ReconciliationOutlined style={{ fontSize: "1.6rem" }} />,
          label: `Profile`,
          role: ["employee"],
     },
];
