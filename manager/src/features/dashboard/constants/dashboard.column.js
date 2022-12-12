export const titleSizeList = [
  {
    text: "30x30",
    value: "30x30",
  },
  {
    text: "30x60",
    value: "30x60",
  },
  {
    text: "40x80",
    value: "40x80",
  },
  {
    text: "50x50",
    value: "50x50",
  },
  {
    text: "60x60",
    value: "60x60",
  },
  {
    text: "80x80",
    value: "80x80",
  },
];
export const abrasionResistanceList = [
  {
    text: "PEI I",
    value: "PEI I",
  },
  {
    text: "PEI II",
    value: "PEI II",
  },
  {
    text: "PEI III",
    value: "PEI III",
  },
  {
    text: "PEI IV",
    value: "PEI IV",
  },
  {
    text: "PEI V",
    value: "PEI V",
  },
];

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
