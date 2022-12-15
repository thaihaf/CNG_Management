export const DashboardEndPoints = {
  DASHBOARD_CUSTOMER_DAILY:
    "/dashboard/customer/daily?startDate=:startDate&endDate=:endDate&sort=createDate,ASC",
  DASHBOARD_MANAGER: "/dashboard",
  //inventory
  PRODUCT_INVENTORY: "/dashboard/product/inventory",
  CATEGORY_INVENTORY: "/dashboard/category/inventory",
  SUPPLIER_INVENTORY: "/dashboard/supplier/inventory",
  WAREHOUSE_INVENTORY: "/dashboard/warehouse/inventory",
  //profit
  PRODUCT_PROFIT: "/dashboard/product/revenue",
  CATEGORY_PROFIT: "/dashboard/category/revenue",
  SUPPLIER_PROFIT: "/dashboard/supplier/revenue",
  CUSTOMER_PROFIT: "/dashboard/customer/revenue",
  EMPLOYEE_PROFIT: "/dashboard/employee/revenue",
};
