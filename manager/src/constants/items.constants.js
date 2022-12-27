import React from "react";
import {
  TeamOutlined,
  ReconciliationOutlined,
  AppstoreOutlined,
  ContactsOutlined,
  TagOutlined,
  UserOutlined,
  BankOutlined,
  InboxOutlined,
  UsergroupDeleteOutlined,
  ImportOutlined,
  DashboardOutlined,
  IdcardOutlined,
  LineChartOutlined,
  ExportOutlined,
  ShopOutlined,
  FundViewOutlined,
  SolutionOutlined,
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
    getItem(["admin"], "Thống kê", "statistical", <FundViewOutlined />, [
      getItem(
        ["admin"],
        "Tổng quát",
        DashboardPaths.DASHBOARD,
        <DashboardOutlined />
      ),
      getItem(
        ["admin"],
        "Theo thời gian",
        DashboardPaths.DASHBOARD_MANAGER,
        <DashboardOutlined />
      ),
      getItem(
        ["admin"],
        "Hằng ngày",
        DashboardPaths.DASHBOARD_CUSTOMER_DAILY,
        <DashboardOutlined />
      ),
      getItem(
        ["admin"],
        "Tồn kho",
        DashboardPaths.PRODUCT_INVENTORY,
        <ReconciliationOutlined />
      ),
      getItem(
        ["admin"],
        "Lợi nhuận",
        DashboardPaths.PRODUCT_PROFIT,
        <LineChartOutlined />
      ),
    ]),
    getItem(
      ["admin", "employee"],
      "Sản phẩm",
      "product-manager",
      <ShopOutlined />,
      [
        getItem(
          ["admin", "employee"],
          "Danh sách sản phẩm",
          ProductManagerPaths.PRODUCT_MANAGER,
          <InboxOutlined />
        ),
        getItem(
          ["admin", "employee"],
          "Nhập sản phẩm",
          ImportProductManagerPaths.LIST_PRODUCT_IMPORT,
          <ImportOutlined />
        ),
        getItem(
          ["admin", "employee"],
          "Xuất sản phẩm",
          ProductExportManagerPaths.LIST_PRODUCT_EXPORT,
          <ExportOutlined />
        ),
      ]
    ),
    getItem(
      ["admin", "employee"],
      "Công nợ",
      "debt-manager",
      <SolutionOutlined />,
      [
        getItem(
          ["admin", "employee"],
          "Nhà cung cấp",
          SupplierManagerPaths.SUPPLIER_LIST,
          <ContactsOutlined />
        ),
        getItem(
          ["admin", "employee"],
          "Khách hàng",
          CustomerManagerPaths.CUSTOMER_LIST,
          <IdcardOutlined />
        ),
        getItem(
          ["admin"],
          "Công nợ Nhà cung cấp",
          SupplierDebtPaths.SUPPLIER_DEBT_MANAGER,
          <ContactsOutlined />
        ),
        getItem(
          ["admin", "employee"],
          "Công nợ Khách hàng",
          CustomerDebtPaths.CUSTOMER_DEBT_MANAGER,
          <IdcardOutlined />
        ),
      ]
    ),
    getItem(
      ["admin", "employee"],
      "Quản lý",
      "user-manager",
      <ShopOutlined />,
      [
        getItem(
          ["admin"],
          "Tài khoản",
          EmployeeManagerPaths.ACCOUNT_LIST,
          <UserOutlined />
        ),
        getItem(
          ["admin"],
          "Nhân viên",
          EmployeeManagerPaths.EMPLOYEE_MANAGER,
          <UsergroupDeleteOutlined />
        ),
        getItem(
          ["admin", "employee"],
          "Nhãn hàng",
          BrandManagerPaths.BRAND_LIST,
          <TagOutlined />
        ),
        getItem(
          ["admin", "employee"],
          "Chức năng",
          CategoryManagerPaths.CATEGORY_LIST,
          <AppstoreOutlined />
        ),
        getItem(
          ["admin", "employee"],
          "Kho hàng",
          WarehouseManagerPaths.WAREHOUSE_LIST,
          <BankOutlined />
        ),
      ]
    ),
    getItem(
      ["employee"],
      "Hồ sơ",
      EmployeeManagerPaths.EMPLOYEE_PROFILE,
      <TeamOutlined />
    ),
  ];
};

export const listKeySideBar = [
  "statistical",
  "product-manager",
  "user-manager",
  "debt-manager",
];
