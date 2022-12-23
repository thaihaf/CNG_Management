import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import queryString from "query-string";
import { motion } from "framer-motion/dist/framer-motion";
import { Excel } from "antd-table-saveas-excel";

import { SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Input,
  notification,
  Radio,
  Space,
  Statistic,
  Table,
  Typography,
} from "antd";

import "./ProductInventory.css";

import { get } from "lodash";

import dayjs from "dayjs";
import {
  DashboardPaths,
  getProductInventory,
} from "features/dashboard/dashboard";
import api from "features/dashboard/api/dashboard.api";
import { productInventoryColumnsExport } from "features/dashboard/constants/dashboard.column";

const { Title, Text } = Typography;

export default function ProductInventory() {
  const { listProductInventory, totalElements, page, size } = useSelector(
    (state) => state.dashboard.productInventory
  );
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const params = queryString.parse(location.search);
  const [isLoading, setIsLoading] = useState(false);
  const [tabPosition, setTabPosition] = useState();

  let query = queryString.parse(location.search);

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };
  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText("");
  };
  const getColumnSearchProps = (dataIndex, nestedValue) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div
        style={{
          padding: 8,
        }}
      >
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{
            marginBottom: 8,
            display: "block",
          }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            icon={<SearchOutlined />}
            size="small"
            style={{
              width: 90,
            }}
          >
            Search
          </Button>
          <Button
            onClick={() => clearFilters && handleReset(clearFilters)}
            size="small"
            style={{
              width: 90,
            }}
          >
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({
                closeDropdown: false,
              });
              setSearchText(selectedKeys[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined
        style={{
          color: filtered ? "#1890ff" : undefined,
        }}
      />
    ),
    onFilter: (value, record) => {
      if (typeof record[dataIndex] === "string") {
        return record[dataIndex]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase());
      } else {
        return get(record, dataIndex)
          [nestedValue].toString()
          .toLowerCase()
          .includes(value.toLowerCase());
      }
    },

    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{
            backgroundColor: "#ffc069",
            padding: 0,
          }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (a, b, index) => <Text>{index + 1}</Text>,
    },
    {
      title: "Mã sản phẩm",
      dataIndex: ["productDTO", "id"],
      key: "productId",
      align: "center",
    },
    {
      title: "Tồn đầu kỳ (m2)",
      dataIndex: ["productInventoryStoreDTO", "squareMeterPerBoxAtBeginPeriod"],
      key: "squareMeterPerBoxAtBeginPeriod",
      align: "center",
      render: (value) => {
        return <Statistic value={value} precision={value === 0 ? 0 : 2} />;
      },
    },
    {
      title: "Số lượng nhập (m2)",
      dataIndex: ["productInventoryStoreDTO", "squareMeterPerBoxImport"],
      key: "squareMeterPerBoxImport",
      align: "center",
      render: (value) => {
        return <Statistic value={value} precision={value === 0 ? 0 : 2} />;
      },
    },
    {
      title: "Số lượng xuất (m2)",
      dataIndex: ["productInventoryStoreDTO", "squareMeterPerBoxExport"],
      key: "squareMeterPerBoxExport",
      align: "center",
      render: (value) => {
        return <Statistic value={value} precision={value === 0 ? 0 : 2} />;
      },
    },
    {
      title: "Số lượng nhập lại (m2)",
      dataIndex: ["productInventoryStoreDTO", "squareMeterPerBoxReExport"],
      key: "squareMeterPerBoxReExport",
      align: "center",
      render: (value) => {
        return <Statistic value={value} precision={value === 0 ? 0 : 2} />;
      },
    },
    {
      title: "Tồn cuối kỳ (m2)",
      dataIndex: ["productInventoryStoreDTO", "squareMeterPerBoxAtEndPeriod"],
      key: "squareMeterPerBoxAtEndPeriod",
      align: "center",
      render: (value) => {
        return <Statistic value={value} precision={value === 0 ? 0 : 2} />;
      },
    },
    {
      title: "Giá trị tồn (vnđ)",
      dataIndex: ["productInventoryStoreDTO", "inventoryCost"],
      key: "inventoryCost",
      align: "center",
      render: (value) => {
        return <Statistic value={value} precision={0} />;
      },
    },
  ];
  const columnsProductInventory = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (a, b, index) => <Text>{index + 1}</Text>,
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
      render: (value) => {
        return <Statistic value={value} precision={0} />;
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
      render: (value) => {
        return <Statistic value={value} precision={value === 0 ? 0 : 2} />;
      },
    },
    {
      title: "Số lượng nhập (m2)",
      dataIndex: ["productDetailInventoryStoreDTO", "squareMeterPerBoxImport"],
      key: "squareMeterPerBoxImport",
      align: "center",
      render: (value) => {
        return <Statistic value={value} precision={value === 0 ? 0 : 2} />;
      },
    },
    {
      title: "Số lượng xuất (m2)",
      dataIndex: ["productDetailInventoryStoreDTO", "squareMeterPerBoxExport"],
      key: "squareMeterPerBoxExport",
      align: "center",
      render: (value) => {
        return <Statistic value={value} precision={value === 0 ? 0 : 2} />;
      },
    },
    {
      title: "Số lượng nhập lại (m2)",
      dataIndex: [
        "productDetailInventoryStoreDTO",
        "squareMeterPerBoxReExport",
      ],
      key: "squareMeterPerBoxReExport",
      align: "center",
      render: (value) => {
        return <Statistic value={value} precision={value === 0 ? 0 : 2} />;
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
      render: (value) => {
        return <Statistic value={value} precision={value === 0 ? 0 : 2} />;
      },
    },
    {
      title: "Giá trị tồn (vnđ)",
      dataIndex: ["productDetailInventoryStoreDTO", "inventoryCost"],
      key: "inventoryCost",
      align: "center",
      render: (value) => {
        return <Statistic value={value} precision={0} />;
      },
    },
  ];

  const initialValues =
    params.month && params.year
      ? {
          data: dayjs(
            params.month.length === 1
              ? `0${params.month}/${params.year}`
              : `${params.month}/${params.year}`,
            "MM/YYYY"
          ),
        }
      : { data: dayjs(`${dayjs().month() + 1}/${dayjs().year()}`, "MM/YYYY") };

  const onHandlePagination = (pageCurrent, pageSize) => {
    const params = queryString.parse(location.search);

    const page = pageCurrent.toString();
    const size = pageSize.toString();

    history.push({
      pathname: DashboardPaths.PRODUCT_INVENTORY,
      search: queryString.stringify({
        ...params,
        size: size,
        page: page,
        month: `${initialValues.data.month() + 1}`,
        year: `${initialValues.data.year()}`,
      }),
    });
  };

  const handlExportExcel = async () => {
    if (query.page) {
      query.page = query.page - 1;
    }
    query = {
      ...query,
      month: initialValues.data.month() + 1,
      year: initialValues.data.year(),
      size: 999999,
    };

    try {
      let res = await api.getProductInventory(query);
      let dataExport = [];

      res.data.content.map((item) => {
        let list2 = item.productDetailInventoryDTOS;

        if (list2) {
          const dataTemp = {
            productDetailInventoryStoreDTO: {
              ...item.productInventoryStoreDTO,
            },
          };
          dataExport = [...dataExport, ...list2, dataTemp];
        } else {
          const dataTemp = {
            productDetailInventoryStoreDTO: {
              ...item.productInventoryStoreDTO,
            },
            productDetailDTO: { productId: item.productDTO.id },
          };
          dataExport = [...dataExport, dataTemp];
        }
      });

      const excel = new Excel();
      excel.addSheet("Tồn kho theo sản phẩm");

      excel.setTHeadStyle({
        h: "center",
        v: "center",
        border: true,
        fontName: "SF Mono",
      });
      excel.setTBodyStyle({
        h: "center",
        v: "center",
        border: true,
        fontName: "SF Mono",
      });

      excel.drawCell(0, 0, {
        hMerge: 10,
        vMerge: 3,
        value: `Tồn kho theo sản phẩm : ${
          initialValues.data.month() + 1
        }-${initialValues.data.year()}`,
        style: {
          bold: true,
          border: true,
          v: "center",
          h: "center",
          fontSize: 25,
          fontName: "SF Mono",
          background: "FFC000",
        },
      });

      excel.addColumns(productInventoryColumnsExport);
      excel.addDataSource(dataExport);

      excel.saveAs(
        `Tồn kho theo sản phẩm ${
          initialValues.data.month() + 1
        }-${initialValues.data.year()}.xlsx`
      );
    } catch (err) {
      notification.error({
        message: "Tồn kho theo sản phẩm",
        description: "Xuất dữ liệu không thành công!",
      });
    }
  };

  useEffect(() => {
    setIsLoading(true);

    if (query.page) {
      query.page = query.page - 1;
    }
    query = {
      ...query,
      month: initialValues.data.month() + 1,
      year: initialValues.data.year(),
    };

    dispatch(getProductInventory(query))
      .then(unwrapResult)
      .then(() => {
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        if (err.response.status === 400) {
          notification.error({
            message: "Tồn kho theo sản phẩm",
            description: "Tham số không đúng, vui lòng kiểm tra lại",
          });
        }
      });
  }, [dispatch, location]);

  return (
    <div className="product-inventory">
      <div className="filter">
        <Title level={5} style={{ marginBottom: 0 }}>
          Xuất dữ liệu
        </Title>

        <Radio.Group onChange={(e) => setTabPosition(e.target.value)}>
          <Radio.Button value="excel" onClick={() => handlExportExcel()}>
            Excel
          </Radio.Button>
          <Radio.Button value="csv">CSV</Radio.Button>
          <Radio.Button value="pdf">PDF</Radio.Button>
          <Radio.Button value="print">Print</Radio.Button>
        </Radio.Group>
      </div>

      <motion.div
        animate={{ opacity: [0, 1], y: [50, 0] }}
        exit={{ opacity: [1, 0] }}
        transition={{ duration: 1 }}
      >
        <Table
          rowKey={(record) => record.productDTO.id}
          rowClassName={(record, index) =>
            index % 2 === 0
              ? "table-row table-row-even"
              : "table-row table-row-odd"
          }
          scroll={{ x: "maxContent" }}
          columns={columns}
          dataSource={[...listProductInventory]}
          loading={isLoading}
          pagination={
            totalElements !== 0
              ? {
                  current: page,
                  pageSize: size,
                  total: totalElements,
                  showSizeChanger: true,
                  showQuickJumper: true,
                  position: ["bottomCenter"],
                  pageSizeOptions: ["10", "20", "50", "100"],
                  showTotal: (total, range) =>
                    `${range[0]}-${range[1]} of ${total} items`,
                  onChange: (page, size) => onHandlePagination(page, size),
                  locale: {
                    jump_to: "",
                    page: "trang",
                    items_per_page: "/ trang",
                  },
                }
              : false
          }
          expandable={{
            expandedRowRender: (record) =>
              record.productDetailInventoryDTOS && (
                <Table
                  bordered
                  loading={isLoading}
                  columns={columnsProductInventory}
                  rowKey={(record) => record.productDetailDTO.id}
                  dataSource={[...record.productDetailInventoryDTOS]}
                  pagination={false}
                  className="productsExpande"
                />
              ),
          }}
        />
      </motion.div>
    </div>
  );
}
