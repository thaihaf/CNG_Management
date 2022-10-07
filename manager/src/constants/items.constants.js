import React from 'react';
import { TeamOutlined, FileDoneOutlined, ReconciliationOutlined } from "@ant-design/icons/";

export const siderBarAdminItems = [
     {
          key: "1",
          icon: <TeamOutlined style={{ fontSize: '1.6rem' }}/>,
          label: `Account`,
          children: [
               { key: "employee-list", label: "Employee" },
               { key: "supplier-list", label: "Supplier" },
               { key: "customer-list", label: "Customer" },
          ],
     },
     {
          key: "2",
          icon: <FileDoneOutlined style={{ fontSize: '1.6rem' }}/>,
          label: `Items`,
          children: [
               { key: "product-list", label: "Product" },
               { key: "brand-list", label: "Brand" },
          ],
     },
     {
          key: "3",
          icon: <ReconciliationOutlined style={{ fontSize: '1.6rem' }} />,
          label: `Actions`,
          children: [
               { key: "import-product", label: "Import Product" },
               { key: "export-product", label: "Export Product" },
          ],
     },
];
