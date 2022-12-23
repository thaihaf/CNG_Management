export const dailyReportColumnsExport = [
  {
    title: "STT",
    dataIndex: "stt",
    key: "stt",
  },
  {
    title: "Đơn hàng",
    children: [
      {
        title: "Mã đơn xuất hàng",
        dataIndex: "exportId",
        key: "exportId",
      },
      {
        title: "Ngày tạo",
        dataIndex: "createDate",
        key: "createDate",
      },
      {
        title: "Loại xuất hàng",
        dataIndex: "exportType",
        key: "exportType",
      },
      {
        title: "Người bán",
        dataIndex: "employeeName",
        key: "employeeName",
      },
    ],
  },
  {
    title: "Khách hàng",
    children: [
      {
        title: "Tên khách hàng",
        dataIndex: "customerName",
        key: "customerName",
      },
      {
        title: "Địa chỉ khách hàng",
        dataIndex: "customerAddress",
        key: "customerAddress",
      },
    ],
  },
  {
    title: "Sản phẩm",
    children: [
      {
        title: "Mã sản phẩm",
        dataIndex: "productId",
        key: "productId",
      },
      {
        title: "Số lô",
        dataIndex: "shipment",
        key: "shipment",
      },
      {
        title: "Loại sản phẩm",
        dataIndex: "type",
        key: "type",
      },
      {
        title: "Số lượng (m2)",
        dataIndex: "totalSquareMeter",
        key: "totalSquareMeter",
        render: (value, row, index) => {
          if (row.exportId) {
            return {
              children: value,
            };
          }
          return {
            children: value,
            __style__: {
              color: "FF0000",
              bold: true,
              fontSize: 14,
            },
          };
        },
      },
      {
        title: "Đơn giá nhập (vnđ)",
        dataIndex: "costPerSquareMeter",
        key: "costPerSquareMeter",
        __numFmt__: "#,##0",
      },
      {
        title: "Đơn giá bán (vnđ)",
        dataIndex: "pricePerSquareMeter",
        key: "pricePerSquareMeter",
        __numFmt__: "#,##0",
      },
      {
        title: "Thành tiền (vnđ)",
        dataIndex: "totalPrice",
        key: "totalPrice",
        __numFmt__: "#,##0",
        render: (value, row, index) => {
          if (row.exportId) {
            return {
              children: value,
            };
          }
          return {
            children: value,
            __style__: {
              color: "FF0000",
              bold: true,
              fontSize: 14,
            },
          };
        },
      },
      {
        title: "Tổng lợi nhuận (vnđ)",
        dataIndex: "revenue",
        key: "revenue",
        __numFmt__: "#,##0",
        render: (value, row, index) => {
          if (row.exportId) {
            return {
              children: value,
            };
          }
          return {
            children: value,
            __style__: {
              color: "FF0000",
              bold: true,
              fontSize: 14,
            },
          };
        },
      },
    ],
  },
];

export const dayDashboardColumnsExport = [
  {
    title: "STT",
    key: "index",
    render: (value, row, index) => index + 1,
  },
  {
    title: "Ngày Tháng Năm",
    key: "date",
    render: (value, record, index) =>
      `${record.day}/${record.month}/${record.year}`,
  },
  {
    title: "Số M2 nhập hàng (m2)",
    dataIndex: "totalSquareMeterImport",
    key: "totalSquareMeterImport",
  },
  {
    title: "Tiền nhập hàng (vnđ)",
    dataIndex: "totalCostImport",
    key: "totalCostImport",
    __numFmt__: "#,##0",
  },
  {
    title: "Số M2 trả hàng (m2)",
    dataIndex: "totalSquareMeterReExport",
    key: "totalSquareMeterReExport",
  },
  {
    title: "Tiền trả hàng (vnđ)",
    dataIndex: "totalPriceReExport",
    key: "totalPriceReExport",
    __numFmt__: "#,##0",
  },
  {
    title: "Số M2 xuất hàng (m2)",
    dataIndex: "totalSquareMeterExport",
    key: "totalSquareMeterExport",
  },
  {
    title: "Tiền xuất hàng (vnđ)",
    dataIndex: "totalPriceExport",
    key: "totalPriceExport",
    __numFmt__: "#,##0",
  },
  {
    title: "Lợi nhuận (vnđ)",
    dataIndex: "revenue",
    key: "revenue",
    __numFmt__: "#,##0",
  },
];
export const monthDashboardColumnsExport = [
  {
    title: "STT",
    key: "index",
    render: (value, row, index) => index + 1,
  },
  {
    title: "Tháng và Năm",
    key: "monthAndYear",
    render: (value, record, index) => `${record.month}/${record.year}`,
  },
  {
    title: "Số M2 nhập hàng (m2)",
    dataIndex: "totalSquareMeterImport",
    key: "totalSquareMeterImport",
  },
  {
    title: "Tiền nhập hàng (vnđ)",
    dataIndex: "totalCostImport",
    key: "totalCostImport",
    __numFmt__: "#,##0",
  },
  {
    title: "Số M2 trả hàng (m2)",
    dataIndex: "totalSquareMeterReExport",
    key: "totalSquareMeterReExport",
  },
  {
    title: "Tiền trả hàng (vnđ)",
    dataIndex: "totalPriceReExport",
    key: "totalPriceReExport",
    __numFmt__: "#,##0",
  },
  {
    title: "Số M2 xuất hàng (m2)",
    dataIndex: "totalSquareMeterExport",
    key: "totalSquareMeterExport",
  },
  {
    title: "Tiền xuất hàng (vnđ)",
    dataIndex: "totalPriceExport",
    key: "totalPriceExport",
    __numFmt__: "#,##0",
  },
  {
    title: "Lợi nhuận (vnđ)",
    dataIndex: "revenue",
    key: "revenue",
    __numFmt__: "#,##0",
  },
];
export const yearDashboardColumnsExport = [
  {
    title: "STT",
    key: "index",
    render: (value, row, index) => index + 1,
  },
  {
    title: "Năm",
    key: "year",
    render: (value, record, index) => `${record.year}`,
  },
  {
    title: "Số M2 nhập hàng (m2)",
    dataIndex: "totalSquareMeterImport",
    key: "totalSquareMeterImport",
  },
  {
    title: "Tiền nhập hàng (vnđ)",
    dataIndex: "totalCostImport",
    key: "totalCostImport",
    __numFmt__: "#,##0",
  },
  {
    title: "Số M2 trả hàng (m2)",
    dataIndex: "totalSquareMeterReExport",
    key: "totalSquareMeterReExport",
  },
  {
    title: "Tiền trả hàng (vnđ)",
    dataIndex: "totalPriceReExport",
    key: "totalPriceReExport",
    __numFmt__: "#,##0",
  },
  {
    title: "Số M2 xuất hàng (m2)",
    dataIndex: "totalSquareMeterExport",
    key: "totalSquareMeterExport",
  },
  {
    title: "Tiền xuất hàng (vnđ)",
    dataIndex: "totalPriceExport",
    key: "totalPriceExport",
    __numFmt__: "#,##0",
  },
  {
    title: "Lợi nhuận (vnđ)",
    dataIndex: "revenue",
    key: "revenue",
    __numFmt__: "#,##0",
  },
];

export const productInventoryColumnsExport = [
  {
    title: "STT",
    key: "index",
    render: (value, row, index) => index + 1,
  },
  {
    title: "Mã sản phẩm",
    dataIndex: ["productDetailDTO", "productId"],
    key: "productId",
    align: "center",
  },
  {
    title: "Số lô",
    dataIndex: ["productDetailDTO", "shipment"],
    key: "shipment",
    align: "center",
  },
  {
    title: "Loại",
    dataIndex: ["productDetailDTO", "type"],
    key: "type",
    align: "center",
  },
  {
    title: "Giá nhập (vnđ)",
    dataIndex: ["productDetailDTO", "costPerSquareMeter"],
    key: "costPerSquareMeter",
    align: "center",
    __numFmt__: "#,##0",
    render: (value, row, index) => {
      if (row.productDetailDTO) {
        return value;
      }
      return {
        children: value === 0 ? `${value}` : value,
        __style__: {
          color: "FF0000",
          bold: true,
          fontSize: 14,
        },
      };
    },
  },
  {
    title: "Tồn đầu kỳ (m2)",
    dataIndex: [
      "productDetailInventoryStoreDTO",
      "squareMeterPerBoxAtBeginPeriod",
    ],
    key: "squareMeterPerBoxAtBeginPeriod",
    align: "center",
    render: (value, row, index) => {
      if (row.productDetailDTO) {
        return value;
      }
      return {
        children: value === 0 ? `${value}` : value,
        __style__: {
          color: "FF0000",
          bold: true,
          fontSize: 14,
        },
      };
    },
  },
  {
    title: "Số lượng nhập (m2)",
    dataIndex: ["productDetailInventoryStoreDTO", "squareMeterPerBoxImport"],
    key: "squareMeterPerBoxImport",
    align: "center",
    render: (value, row, index) => {
      if (row.productDetailDTO) {
        return value;
      }
      return {
        children: value === 0 ? `${value}` : value,
        __style__: {
          color: "FF0000",
          bold: true,
          fontSize: 14,
        },
      };
    },
  },
  {
    title: "Số lượng xuất (m2)",
    dataIndex: ["productDetailInventoryStoreDTO", "squareMeterPerBoxExport"],
    key: "squareMeterPerBoxExport",
    align: "center",
    render: (value, row, index) => {
      if (row.productDetailDTO) {
        return value;
      }
      return {
        children: value === 0 ? `${value}` : value,
        __style__: {
          color: "FF0000",
          bold: true,
          fontSize: 14,
        },
      };
    },
  },
  {
    title: "Số lượng nhập lại (m2)",
    dataIndex: ["productDetailInventoryStoreDTO", "squareMeterPerBoxReExport"],
    key: "squareMeterPerBoxReExport",
    align: "center",
    render: (value, row, index) => {
      if (row.productDetailDTO) {
        return value;
      }
      return {
        children: value === 0 ? `${value}` : value,
        __style__: {
          color: "FF0000",
          bold: true,
          fontSize: 14,
        },
      };
    },
  },
  {
    title: "Tồn cuối kỳ (m2)",
    dataIndex: [
      "productDetailInventoryStoreDTO",
      "squareMeterPerBoxAtEndPeriod",
    ],
    key: "squareMeterPerBoxAtEndPeriod",
    align: "center",
    render: (value, row, index) => {
      if (row.productDetailDTO) {
        return value;
      }
      return {
        children: value === 0 ? `${value}` : value,
        __style__: {
          color: "FF0000",
          bold: true,
          fontSize: 14,
        },
      };
    },
  },
  {
    title: "Giá trị tồn (vnđ)",
    dataIndex: ["productDetailInventoryStoreDTO", "inventoryCost"],
    key: "inventoryCost",
    align: "center",
    __numFmt__: "#,##0",
    render: (value, row, index) => {
      if (row.productDetailDTO) {
        return value;
      }
      return {
        children: value === 0 ? `${value}` : value,
        __style__: {
          color: "FF0000",
          bold: true,
          fontSize: 14,
        },
      };
    },
  },
];
export const supplierInventoryColumnsExport = [
  {
    title: "STT",
    key: "index",
    render: (value, row, index) => index + 1,
  },
  {
    title: "Tên Nhà cung cấp",
    dataIndex: ["brandDTO", "supplierName"],
    key: "supplierName",
    align: "center",
  },
  {
    title: "Tên nhãn hàng",
    dataIndex: ["brandDTO", "brandName"],
    key: "brandName",
    align: "center",
  },
  {
    title: "Tồn đầu kỳ (m2)",
    dataIndex: ["brandInventoryStoreDTO", "squareMeterPerBoxAtBeginPeriod"],
    key: "squareMeterPerBoxAtBeginPeriod",
    align: "center",
    render: (value, row, index) => {
      if (row.brandDTO) {
        return value;
      }
      return {
        children: value === 0 ? `${value}` : value,
        __style__: {
          color: "FF0000",
          bold: true,
          fontSize: 14,
        },
      };
    },
  },
  {
    title: "Số lượng nhập (m2)",
    dataIndex: ["brandInventoryStoreDTO", "squareMeterPerBoxImport"],
    key: "squareMeterPerBoxImport",
    align: "center",
    render: (value, row, index) => {
      if (row.brandDTO) {
        return value;
      }
      return {
        children: value === 0 ? `${value}` : value,
        __style__: {
          color: "FF0000",
          bold: true,
          fontSize: 14,
        },
      };
    },
  },
  {
    title: "Số lượng xuất (m2)",
    dataIndex: ["brandInventoryStoreDTO", "squareMeterPerBoxExport"],
    key: "squareMeterPerBoxExport",
    align: "center",
    render: (value, row, index) => {
      if (row.brandDTO) {
        return value;
      }
      return {
        children: value === 0 ? `${value}` : value,
        __style__: {
          color: "FF0000",
          bold: true,
          fontSize: 14,
        },
      };
    },
  },
  {
    title: "Số lượng nhập lại (m2)",
    dataIndex: ["brandInventoryStoreDTO", "squareMeterPerBoxReExport"],
    key: "squareMeterPerBoxReExport",
    align: "center",
    render: (value, row, index) => {
      if (row.brandDTO) {
        return value;
      }
      return {
        children: value === 0 ? `${value}` : value,
        __style__: {
          color: "FF0000",
          bold: true,
          fontSize: 14,
        },
      };
    },
  },
  {
    title: "Tồn cuối kỳ (m2)",
    dataIndex: ["brandInventoryStoreDTO", "squareMeterPerBoxAtEndPeriod"],
    key: "squareMeterPerBoxAtEndPeriod",
    align: "center",
    render: (value, row, index) => {
      if (row.brandDTO) {
        return value;
      }
      return {
        children: value === 0 ? `${value}` : value,
        __style__: {
          color: "FF0000",
          bold: true,
          fontSize: 14,
        },
      };
    },
  },
  {
    title: "Giá trị tồn (vnđ)",
    dataIndex: ["brandInventoryStoreDTO", "inventoryCost"],
    key: "inventoryCost",
    align: "center",
    render: (value, row, index) => {
      if (row.brandDTO) {
        return value;
      }
      return {
        children: value === 0 ? `${value}` : value,
        __style__: {
          color: "FF0000",
          bold: true,
          fontSize: 14,
        },
      };
    },
  },
];
export const categoryInventoryColumnsExport = [
  {
    title: "STT",
    dataIndex: "index",
    key: "index",
    align: "center",
    render: (a, b, index) => index + 1,
  },
  {
    title: "Tên chức năng",
    dataIndex: ["categoryDTO", "categoryName"],
    key: "categoryName",
    align: "center",
  },
  {
    title: "Tồn đầu kỳ (m2)",
    dataIndex: ["categoryInventoryStoreDTO", "squareMeterPerBoxAtBeginPeriod"],
    key: "squareMeterPerBoxAtBeginPeriod",
    align: "center",
  },
  {
    title: "Số lượng nhập (m2)",
    dataIndex: ["categoryInventoryStoreDTO", "squareMeterPerBoxImport"],
    key: "squareMeterPerBoxImport",
    align: "center",
  },
  {
    title: "Số lượng xuất (m2)",
    dataIndex: ["categoryInventoryStoreDTO", "squareMeterPerBoxExport"],
    key: "squareMeterPerBoxExport",
    align: "center",
  },
  {
    title: "Số lượng nhập lại (m2)",
    dataIndex: ["categoryInventoryStoreDTO", "squareMeterPerBoxReExport"],
    key: "squareMeterPerBoxReExport",
    align: "center",
  },
  {
    title: "Tồn cuối kỳ (m2)",
    dataIndex: ["categoryInventoryStoreDTO", "squareMeterPerBoxAtEndPeriod"],
    key: "squareMeterPerBoxAtEndPeriod",
    align: "center",
  },
  {
    title: "Giá trị tồn (vnđ)",
    dataIndex: ["categoryInventoryStoreDTO", "inventoryCost"],
    key: "inventoryCost",
    align: "center",
    __numFmt__: "#,##0",
  },
];
export const warehouseInventoryColumnsExport = [
  {
    title: "STT",
    dataIndex: "index",
    key: "index",
    align: "center",
    render: (a, b, index) => index + 1,
  },
  {
    title: "Tên kho",
    dataIndex: ["warehouseDTO", "warehouseName"],
    key: "warehouseName",
    align: "center",
  },
  {
    title: "Tồn đầu kỳ (m2)",
    dataIndex: ["inventoryStoreDTO", "squareMeterPerBoxAtBeginPeriod"],
    key: "squareMeterPerBoxAtBeginPeriod",
    align: "center",
  },
  {
    title: "Số lượng nhập (m2)",
    dataIndex: ["inventoryStoreDTO", "squareMeterPerBoxImport"],
    key: "squareMeterPerBoxImport",
    align: "center",
  },
  {
    title: "Số lượng xuất (m2)",
    dataIndex: ["inventoryStoreDTO", "squareMeterPerBoxExport"],
    key: "squareMeterPerBoxExport",
    align: "center",
  },
  {
    title: "Số lượng nhập lại (m2)",
    dataIndex: ["inventoryStoreDTO", "squareMeterPerBoxReExport"],
    key: "squareMeterPerBoxReExport",
    align: "center",
  },
  {
    title: "Tồn cuối kỳ (m2)",
    dataIndex: ["inventoryStoreDTO", "squareMeterPerBoxAtEndPeriod"],
    key: "squareMeterPerBoxAtEndPeriod",
    align: "center",
  },
  {
    title: "Giá trị tồn (vnđ)",
    dataIndex: ["inventoryStoreDTO", "inventoryCost"],
    key: "inventoryCost",
    align: "center",
    __numFmt__: "#,##0",
  },
];

export const categoryProfitColumnsExport = [
  {
    title: "STT",
    dataIndex: "index",
    key: "index",
    align: "center",
    render: (a, b, index) => index + 1,
  },
  {
    title: "Tên chức năng",
    dataIndex: ["categoryDTO", "categoryName"],
    key: "categoryName",
    align: "center",
  },
  {
    title: "Số lượng xuất (m2)",
    dataIndex: ["categoryRevenueDTO", "squareMeterExport"],
    key: "squareMeterExport",
    align: "center",
  },
  {
    title: "Số lượng nhập lại (m2)",
    dataIndex: ["categoryRevenueDTO", "squareMeterReExport"],
    key: "squareMeterReExport",
    align: "center",
  },
  {
    title: "Tiền nhập (vnđ)",
    dataIndex: ["categoryRevenueDTO", "totalCostImport"],
    key: "totalCostImport",
    align: "center",
    __numFmt__: "#,##0",
  },
  {
    title: "Tiền nhập lại (vnđ)",
    dataIndex: ["categoryRevenueDTO", "totalPriceReExport"],
    key: "totalPriceReExport",
    align: "center",
    __numFmt__: "#,##0",
  },
  {
    title: "Doanh số (vnđ)",
    dataIndex: ["categoryRevenueDTO", "totalPriceExport"],
    key: "totalPriceExport",
    align: "center",
    __numFmt__: "#,##0",
  },
  {
    title: "Lợi nhuận (vnđ)",
    dataIndex: ["categoryRevenueDTO", "profit"],
    key: "profit",
    align: "center",
    __numFmt__: "#,##0",
  },
];
export const employeeProfitColumnsExport = [
  {
    title: "STT",
    dataIndex: "index",
    key: "index",
    align: "center",
    render: (a, b, index) => index + 1,
  },
  {
    title: "Tên nhân viên",
    dataIndex: "employeeDTO",
    key: "employeeId",
    align: "center",
    render: (value) => `${value.firstName} ${value.lastName}`,
  },
  {
    title: "Số lượng xuất (m2)",
    dataIndex: ["employeeRevenueDTO", "squareMeterExport"],
    key: "squareMeterExport",
    align: "center",
  },
  {
    title: "Số lượng nhập lại (m2)",
    dataIndex: ["employeeRevenueDTO", "squareMeterReExport"],
    key: "squareMeterReExport",
    align: "center",
  },
  {
    title: "Tiền nhập (vnđ)",
    dataIndex: ["employeeRevenueDTO", "totalCostImport"],
    key: "totalCostImport",
    align: "center",
    __numFmt__: "#,##0",
  },
  {
    title: "Tiền nhập lại (vnđ)",
    dataIndex: ["employeeRevenueDTO", "totalPriceReExport"],
    key: "totalPriceReExport",
    align: "center",
    __numFmt__: "#,##0",
  },
  {
    title: "Doanh số (vnđ)",
    dataIndex: ["employeeRevenueDTO", "totalPriceExport"],
    key: "totalPriceExport",
    align: "center",
    __numFmt__: "#,##0",
  },
  {
    title: "Lợi nhuận (vnđ)",
    dataIndex: ["employeeRevenueDTO", "profit"],
    key: "profit",
    align: "center",
    __numFmt__: "#,##0",
  },
];
export const customerProfitColumnsExport = [
  {
    title: "STT",
    dataIndex: "index",
    key: "index",
    align: "center",
    render: (a, b, index) => index + 1,
  },
  {
    title: "Tên cửa hàng",
    dataIndex: ["customerDTO", "shopName"],
    key: "shopName",
    align: "center",
  },
  {
    title: "Số lượng xuất (m2)",
    dataIndex: ["customerRevenueDTO", "squareMeterExport"],
    key: "squareMeterExport",
    align: "center",
  },
  {
    title: "Số lượng nhập lại (m2)",
    dataIndex: ["customerRevenueDTO", "squareMeterReExport"],
    key: "squareMeterReExport",
    align: "center",
  },
  {
    title: "Tiền nhập (vnđ)",
    dataIndex: ["customerRevenueDTO", "totalCostImport"],
    key: "totalCostImport",
    align: "center",
    __numFmt__: "#,##0",
  },
  {
    title: "Tiền nhập lại (vnđ)",
    dataIndex: ["customerRevenueDTO", "totalPriceReExport"],
    key: "totalPriceReExport",
    align: "center",
    __numFmt__: "#,##0",
  },
  {
    title: "Doanh số (vnđ)",
    dataIndex: ["customerRevenueDTO", "totalPriceExport"],
    key: "totalPriceExport",
    align: "center",
    __numFmt__: "#,##0",
  },
  {
    title: "Lợi nhuận (vnđ)",
    dataIndex: ["customerRevenueDTO", "profit"],
    key: "profit",
    align: "center",
    __numFmt__: "#,##0",
  },
];
export const productProfitColumnsExport = [
  {
    title: "STT",
    key: "index",
    render: (value, row, index) => index + 1,
  },
  {
    title: "Mã sản phẩm",
    dataIndex: ["productDetailDTO", "productId"],
    key: "productId",
    align: "center",
  },
  {
    title: "Số lô",
    dataIndex: ["productDetailDTO", "shipment"],
    key: "shipment",
    align: "center",
  },
  {
    title: "Loại",
    dataIndex: ["productDetailDTO", "type"],
    key: "type",
    align: "center",
  },
  {
    title: "Số lượng xuất (m2)",
    dataIndex: ["productDetailRevenueDTO", "squareMeterExport"],
    key: "squareMeterExport",
    align: "center",
    render: (value, row, index) => {
      if (row.productDetailDTO) {
        return value;
      }
      return {
        children: value === 0 ? `${value}` : value,
        __style__: {
          color: "FF0000",
          bold: true,
          fontSize: 14,
        },
      };
    },
  },
  {
    title: "Số lượng nhập lại (m2)",
    dataIndex: ["productDetailRevenueDTO", "squareMeterReExport"],
    key: "squareMeterReExport",
    align: "center",
    render: (value, row, index) => {
      if (row.productDetailDTO) {
        return value;
      }
      return {
        children: value === 0 ? `${value}` : value,
        __style__: {
          color: "FF0000",
          bold: true,
          fontSize: 14,
        },
      };
    },
  },
  {
    title: "Tiền nhập (vnđ)",
    dataIndex: ["productDetailRevenueDTO", "totalCostImport"],
    key: "totalCostImport",
    align: "center",
    __numFmt__: "#,##0",
    render: (value, row, index) => {
      if (row.productDetailDTO) {
        return value;
      }
      return {
        children: value === 0 ? `${value}` : value,
        __style__: {
          color: "FF0000",
          bold: true,
          fontSize: 14,
        },
      };
    },
  },
  {
    title: "Tiền nhập lại (vnđ)",
    dataIndex: ["productDetailRevenueDTO", "totalPriceReExport"],
    key: "totalPriceReExport",
    align: "center",
    __numFmt__: "#,##0",
    render: (value, row, index) => {
      if (row.productDetailDTO) {
        return value;
      }
      return {
        children: value === 0 ? `${value}` : value,
        __style__: {
          color: "FF0000",
          bold: true,
          fontSize: 14,
        },
      };
    },
  },
  {
    title: "Doanh số (vnđ)",
    dataIndex: ["productDetailRevenueDTO", "totalPriceExport"],
    key: "totalPriceExport",
    align: "center",
    __numFmt__: "#,##0",
    render: (value, row, index) => {
      if (row.productDetailDTO) {
        return value;
      }
      return {
        children: value === 0 ? `${value}` : value,
        __style__: {
          color: "FF0000",
          bold: true,
          fontSize: 14,
        },
      };
    },
  },
  {
    title: "Lợi nhuận (vnđ)",
    dataIndex: ["productDetailRevenueDTO", "profit"],
    key: "profit",
    align: "center",
    __numFmt__: "#,##0",
    render: (value, row, index) => {
      if (row.productDetailDTO) {
        return value;
      }
      return {
        children: value === 0 ? `${value}` : value,
        __style__: {
          color: "FF0000",
          bold: true,
          fontSize: 14,
        },
      };
    },
  },
];
export const suppliertProfitColumnsExport = [
  {
    title: "STT",
    key: "index",
    render: (value, row, index) => index + 1,
  },
  {
    title: "Tên nhà cung cấp",
    dataIndex: ["brandDTO", "supplierName"],
    key: "supplierName",
    align: "center",
  },
  {
    title: "Tên nhãn hàng",
    dataIndex: ["brandDTO", "brandName"],
    key: "brandName",
    align: "center",
  },
  {
    title: "Số lượng xuất (m2)",
    dataIndex: ["brandRevenueDTO", "squareMeterExport"],
    key: "squareMeterExport",
    align: "center",
    render: (value, row, index) => {
      if (row.brandDTO) {
        return value;
      }
      return {
        children: value === 0 ? `${value}` : value,
        __style__: {
          color: "FF0000",
          bold: true,
          fontSize: 14,
        },
      };
    },
  },
  {
    title: "Số lượng nhập lại (m2)",
    dataIndex: ["brandRevenueDTO", "squareMeterReExport"],
    key: "squareMeterReExport",
    align: "center",
    render: (value, row, index) => {
      if (row.brandDTO) {
        return value;
      }
      return {
        children: value === 0 ? `${value}` : value,
        __style__: {
          color: "FF0000",
          bold: true,
          fontSize: 14,
        },
      };
    },
  },
  {
    title: "Tiền nhập (vnđ)",
    dataIndex: ["brandRevenueDTO", "totalCostImport"],
    key: "totalCostImport",
    align: "center",
    __numFmt__: "#,##0",
    render: (value, row, index) => {
      if (row.brandDTO) {
        return value;
      }
      return {
        children: value === 0 ? `${value}` : value,
        __style__: {
          color: "FF0000",
          bold: true,
          fontSize: 14,
        },
      };
    },
  },
  {
    title: "Tiền nhập lại (vnđ)",
    dataIndex: ["brandRevenueDTO", "totalPriceReExport"],
    key: "totalPriceReExport",
    align: "center",
    __numFmt__: "#,##0",
    render: (value, row, index) => {
      if (row.brandDTO) {
        return value;
      }
      return {
        children: value === 0 ? `${value}` : value,
        __style__: {
          color: "FF0000",
          bold: true,
          fontSize: 14,
        },
      };
    },
  },
  {
    title: "Doanh số (vnđ)",
    dataIndex: ["brandRevenueDTO", "totalPriceExport"],
    key: "totalPriceExport",
    align: "center",
    __numFmt__: "#,##0",
    render: (value, row, index) => {
      if (row.brandDTO) {
        return value;
      }
      return {
        children: value === 0 ? `${value}` : value,
        __style__: {
          color: "FF0000",
          bold: true,
          fontSize: 14,
        },
      };
    },
  },
  {
    title: "Lợi nhuận (vnđ)",
    dataIndex: ["brandRevenueDTO", "profit"],
    key: "profit",
    align: "center",
    __numFmt__: "#,##0",
    render: (value, row, index) => {
      if (row.brandDTO) {
        return value;
      }
      return {
        children: value === 0 ? `${value}` : value,
        __style__: {
          color: "FF0000",
          bold: true,
          fontSize: 14,
        },
      };
    },
  },
];