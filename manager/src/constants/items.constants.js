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
import { ProductManagerPaths } from "features/product-manager/productManager";
import { ImportProductManagerPaths } from "features/import-product/importProduct";
import { ProductExportManagerPaths } from "features/export-product/exportProduct";
import { DashboardPaths } from "features/dashboard/dashboard";
import { getRole } from "helpers/auth.helpers";
import { SupplierDebtPaths } from "features/supplier-debt/supplierDebt";
import { CustomerDebtPaths } from "features/customer-debt/customerDebt";
import { EmployeeManagerPaths } from "features/employee-manager/employeeManager";
import { BrandManagerPaths } from "features/brand-manager/brandManager";
import { CustomerManagerPaths } from "features/customer-manager/customerManager";
import { WarehouseManagerPaths } from "features/warehouse-manager/warehouseManager";
import { CategoryManagerPaths } from "features/category-manager/categoryManager";
import { SupplierManagerPaths } from "features/supplier-manager/supplierManager";

export const getSideBarItems = (role) => {
  function getItem(roles, label, key, icon, children, type) {
    if (roles.includes(role)) {
      return {
        key,
        icon,
        children,
        label,
        type,
      };
    }
  }

  return [
    getItem(["admin"], "Thống kê", "statistical", <DashboardOutlined />, [
      getItem(
        ["admin"],
        "Dashboard",
        DashboardPaths.DASHBOARD,
        <DashboardOutlined />
      ),
      getItem(
        ["admin"],
        "Thống kê",
        DashboardPaths.DASHBOARD_MANAGER,
        <DashboardOutlined />
      ),
      getItem(
        ["admin"],
        "Báo cáo hằng ngày",
        DashboardPaths.DASHBOARD_CUSTOMER_DAILY,
        <DashboardOutlined />
      ),
      getItem(
        ["admin"],
        "Tồn kho",
        DashboardPaths.PRODUCT_INVENTORY,
        <DashboardOutlined />
      ),
      getItem(
        ["admin"],
        "Lợi nhuận",
        DashboardPaths.PRODUCT_PROFIT,
        <DashboardOutlined />
      ),
    ]),
    getItem(
      ["admin", "employee"],
      "Sản phẩm",
      "product-manager",
      <DashboardOutlined />,
      [
        getItem(
          ["admin", "employee"],
          "Danh sách sản phẩm",
          ProductManagerPaths.PRODUCT_MANAGER,
          <DashboardOutlined />
        ),
        getItem(
          ["admin", "employee"],
          "Nhập sản phẩm",
          ImportProductManagerPaths.LIST_PRODUCT_IMPORT,
          <DashboardOutlined />
        ),
        getItem(
          ["admin", "employee"],
          "Xuất sản phẩm",
          ProductExportManagerPaths.LIST_PRODUCT_EXPORT,
          <DashboardOutlined />
        ),
      ]
    ),
    getItem(
      ["admin", "employee"],
      "Quản lý",
      "user-manager",
      <DashboardOutlined />,
      [
        getItem(
          ["admin", "employee"],
          "Tài khoản",
          EmployeeManagerPaths.ACCOUNT_LIST,
          <DashboardOutlined />
        ),
        getItem(
          ["admin", "employee"],
          "Nhân viên",
          EmployeeManagerPaths.EMPLOYEE_MANAGER,
          <DashboardOutlined />
        ),
        getItem(
          ["admin", "employee"],
          "Nhãn hàng",
          BrandManagerPaths.BRAND_LIST,
          <DashboardOutlined />
        ),
        getItem(
          ["admin", "employee"],
          "Chức năng",
          CategoryManagerPaths.CATEGORY_LIST,
          <DashboardOutlined />
        ),
        getItem(
          ["admin", "employee"],
          "Kho hàng",
          WarehouseManagerPaths.WAREHOUSE_LIST,
          <DashboardOutlined />
        ),
      ]
    ),
    getItem(
      ["admin", "employee"],
      "Công nợ",
      "debt-manager",
      <DashboardOutlined />,
      [
        getItem(
          ["admin", "employee"],
          "Nhà cung cấp",
          SupplierManagerPaths.SUPPLIER_LIST,
          <DashboardOutlined />
        ),
        getItem(
          ["admin", "employee"],
          "Khách hàng",
          CustomerManagerPaths.CUSTOMER_LIST,
          <DashboardOutlined />
        ),
        getItem(
          ["admin"],
          "Cộng nợ Nhà cung cấp",
          SupplierDebtPaths.SUPPLIER_DEBT_MANAGER,
          <DashboardOutlined />
        ),
        getItem(
          ["admin"],
          "Công nợ Khách hàng",
          CustomerDebtPaths.CUSTOMER_DEBT_MANAGER,
          <DashboardOutlined />
        ),
      ]
    ),
    getItem(
      ["employee"],
      "Hồ sơ",
      EmployeeManagerPaths.EMPLOYEE_PROFILE,
      <ReconciliationOutlined />
    ),
  ];
};

export const listKeySideBar = [
  "statistical",
  "product-manager",
  "user-manager",
  "debt-manager",
];
