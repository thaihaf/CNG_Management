import {
     LaptopOutlined,
     NotificationOutlined,
     UserOutlined,
     MenuFoldOutlined,
     MenuUnfoldOutlined,
     VideoCameraOutlined,
     UploadOutlined,
     BarChartOutlined,
     CloudOutlined,
     AppstoreOutlined,
     TeamOutlined,
     ShopOutlined,
     HomeOutlined,
} from "@ant-design/icons";

export const siderBarAdminItems = [
     {
          key: "1",
          icon: <HomeOutlined />,
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
          icon: <HomeOutlined />,
          label: `2`,
          children: [
               { key: "product", label: "Product" },
               { key: "brand", label: "Brand" },
          ],
     },
     {
          key: "3",
          icon: <HomeOutlined />,
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
          icon: <HomeOutlined />,
          label: `Product`,
     },
     {
          key: "brand",
          icon: <HomeOutlined />,
          label: `Brand`,
     },
     {
          key: "customer",
          icon: <HomeOutlined />,
          label: `Customer`,
     },
     {
          key: "supplier",
          icon: <HomeOutlined />,
          label: `Supplier`,
     },
];
