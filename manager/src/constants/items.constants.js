import { AuditOutlined } from "@ant-design/icons/";

export const siderBarAdminItems = [
     {
          key: "1",
          icon: <AuditOutlined />,
          label: `1`,
          children: [
               { key: "employee", label: "Employee" },
               { key: "supplier", label: "Supplier" },
               { key: "customer", label: "Customer" },
               { key: "account", label: "Account" },
          ],
     },
     {
          key: "2",
          icon: <AuditOutlined />,
          label: `2`,
          children: [
               { key: "product", label: "Product" },
               { key: "brand", label: "Brand" },
          ],
     },
     {
          key: "3",
          icon: <AuditOutlined />,
          label: `3`,
          children: [
               { key: "import-product", label: "Import Product" },
               { key: "export-product", label: "Export Product" },
          ],
     },
];

export const siderBarEmployeeItems = [
     {
          key: "product",
          icon: <AuditOutlined />,
          label: `Product`,
     },
     {
          key: "brand",
          icon: <AuditOutlined />,
          label: `Brand`,
     },
     {
          key: "customer",
          icon: <AuditOutlined />,
          label: `Customer`,
     },
     {
          key: "supplier",
          icon: <AuditOutlined />,
          label: `Supplier`,
     },
];
