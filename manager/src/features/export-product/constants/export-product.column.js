export const buildExportColumns = [
  {
    title: "STT",
    dataIndex: "index",
    key: "index",
    render: (value, record) => {
      if (record.id !== "") {
        return {
          children: value,
        };
      }
      return {
        children: value,
        __style__: {
          bold: true,
          fontSize: 11,
          width: 250,
        },
        props: {
          colSpan: 2,
        },
      };
    },
  },
  {
    title: "TÊN HÀNG",
    dataIndex: "id",
    key: "id",
    width: 250,
    render: (_, record) => {
      const id =
        typeof record.id === "string"
          ? record.id
          : record.productDetailDTO?.productId ??
            record.productDetailDTO[0].productId;

      return {
        children: id,
        __style__: {
          width: 250,
        },
      };
    },
  },
  {
    title: "S.L HỘP",
    dataIndex: "quantityBox",
    key: "quantityBox",
  },
  {
    title: "SỐ LƯỢNG M2",
    dataIndex: "totalSquareMeter",
    key: "totalSquareMeter",
    render: (value, record) => {
      if (record.id !== "") {
        return {
          children: value,
          __style__: {
            width: 250,
          },
        };
      }
      return {
        children: value,
        __style__: {
          bold: true,
          fontSize: 11,
          width: 250,
        },
      };
    },
  },
  {
    title: "ĐƠN GIÁ/M2",
    dataIndex: "pricePerSquareMeter",
    key: "pricePerSquareMeter",
    __numFmt__: "#,##0",
    render: (value, record) => {
      return {
        children: value,
        __style__: {
          width: 250,
        },
      };
    },
  },
  {
    title: "THÀNH TIỀN (vnđ)",
    dataIndex: "totalPrice",
    key: "totalPrice",
    __numFmt__: "#,##0",
    width: 250,
    render: (value, record) => {
      if (record.id !== "") {
        return {
          children: value,
          __style__: {
            width: 250,
          },
        };
      }
      return {
        children: value,
        __style__: {
          bold: true,
          fontSize: 11,
          width: 250,
        },
      };
    },
  },
  {
    title: "GHI CHÚ",
    dataIndex: "noteExport",
    key: "noteExport",
  },
];
