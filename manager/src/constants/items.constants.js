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
          label: `Sản phẩm`,
          role: ["admin", "employee"],
     },
     {
          key: "import-product",
          icon: <ImportOutlined style={{ fontSize: "1.6rem" }} />,
          label: `Nhập sản phẩm`,
          role: ["admin", "employee"],
     },
     {
          key: "export-product",
          icon: <ExportOutlined style={{ fontSize: "1.6rem" }} />,
          label: `Xuất sản phẩm`,
          role: ["admin", "employee"],
     },
     {
          key: "brand",
          icon: <TagOutlined style={{ fontSize: "1.6rem" }} />,
          label: `Nhãn hàng`,
          role: ["admin", "employee"],
     },
     {
          key: "accounts",
          icon: <UserAddOutlined style={{ fontSize: "1.6rem" }} />,
          label: `Tài khoản`,
          role: ["admin"],
     },
     {
          key: "employee",
          icon: <TeamOutlined style={{ fontSize: "1.6rem" }} />,
          label: `Nhân viên`,
          role: ["admin"],
     },
     {
          key: "supplier",
          icon: <ContactsOutlined style={{ fontSize: "1.6rem" }} />,
          label: `Nhà cung cấp`,
          role: ["admin", "employee"],
     },
     {
          key: "supplier-debt",
          icon: <ContactsOutlined style={{ fontSize: "1.6rem" }} />,
          label: `Công nợ Nhà cung cấp`,
          role: ["admin", "employee"],
     },
     {
          key: "customer-debt",
          icon: <UserOutlined style={{ fontSize: "1.6rem" }} />,
          label: `Công nợ Khách hàng`,
          role: ["admin", "employee"],
     },
     {
          key: "warehouse",
          icon: <DatabaseOutlined style={{ fontSize: "1.6rem" }} />,
          label: `Kho hàng`,
          role: ["admin", "employee"],
     },
     {
          key: "category",
          icon: <AppstoreOutlined style={{ fontSize: "1.6rem" }} />,
          label: `Chức năng`,
          role: ["admin", "employee"],
     },
     //
     {
          key: "profile",
          icon: <ReconciliationOutlined style={{ fontSize: "1.6rem" }} />,
          label: `Hồ sơ`,
          role: ["employee"],
     },
];
