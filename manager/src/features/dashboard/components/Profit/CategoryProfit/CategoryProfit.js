import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import queryString from "query-string";
import { motion } from "framer-motion/dist/framer-motion";
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

import "./CategoryProfit.css";
import api from "features/dashboard/api/dashboard.api";
import { get } from "lodash";

import dayjs from "dayjs";
import { getCategoryProfit } from "features/dashboard/dashboard";
import { Excel } from "antd-table-saveas-excel";
import { categoryProfitColumnsExport } from "features/dashboard/constants/dashboard.column";

const { Title, Text } = Typography;

export default function CategoryProfit() {
  const { listCategoryProfit, totalElements, page, size } = useSelector(
    (state) => state.dashboard.categoryProfit
  );
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const params = queryString.parse(location.search);
  const [isLoading, setIsLoading] = useState(false);
  const [tabPosition, setTabPosition] = useState();

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

  const renderTitle = (title, value, format) => {
    let total = listCategoryProfit.reduce((accumulator, currentValue) => {
      const temp = currentValue[value[0]];
      return accumulator + temp[value[1]];
    }, 0);

    if (format === "vnd") {
      if (typeof Intl === "undefined" || !Intl.NumberFormat) {
        total = total.toLocaleString("vi-VN", {
          // style: "currency",
          currency: "VND",
        });
      } else {
        const nf = Intl.NumberFormat();
        total = nf.format(total);
      }
    } else {
      total = total !== 0 ? total.toFixed(2) : 0;
    }

    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div>{title}</div>
        <div style={{ color: "hotpink" }}> Total: {total}</div>
      </div>
    );
  };
  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (a, b, index) => <Text>{index + 1}</Text>,
    },
    {
      title: "Tên chức năng",
      dataIndex: ["categoryDTO", "categoryName"],
      key: "categoryName",
      align: "center",
    },
    {
      title: () =>
        renderTitle(
          "Số lượng xuất (m2)",
          ["categoryRevenueDTO", "squareMeterExport"],
          "vnd"
        ),
      dataIndex: ["categoryRevenueDTO", "squareMeterExport"],
      key: "squareMeterExport",
      align: "center",
      render: (value) => {
        return <Statistic value={value} precision={value === 0 ? 0 : 2} />;
      },
    },
    {
      title: () =>
        renderTitle(
          "Số lượng nhập lại (m2)",
          ["categoryRevenueDTO", "squareMeterReExport"],
          "m2"
        ),
      dataIndex: ["categoryRevenueDTO", "squareMeterReExport"],
      key: "squareMeterReExport",
      align: "center",
      render: (value) => {
        return <Statistic value={value} precision={value === 0 ? 0 : 2} />;
      },
    },
    {
      title: () =>
        renderTitle(
          "Tiền nhập (VND)",
          ["categoryRevenueDTO", "totalCostImport"],
          "vnd"
        ),
      dataIndex: ["categoryRevenueDTO", "totalCostImport"],
      key: "totalCostImport",
      align: "center",
      render: (value) => {
        return <Statistic value={value} precision={0} />;
      },
    },
    {
      title: () =>
        renderTitle(
          "Tiền nhập lại (VND)",
          ["categoryRevenueDTO", "totalPriceReExport"],
          "vnd"
        ),
      dataIndex: ["categoryRevenueDTO", "totalPriceReExport"],
      key: "totalPriceReExport",
      align: "center",
      render: (value) => {
        return <Statistic value={value} precision={0} />;
      },
    },
    {
      title: () =>
        renderTitle(
          "Doanh số (VND)",
          ["categoryRevenueDTO", "totalPriceExport"],
          "vnd"
        ),
      dataIndex: ["categoryRevenueDTO", "totalPriceExport"],
      key: "totalPriceExport",
      align: "center",
      render: (value) => {
        return <Statistic value={value} precision={0} />;
      },
    },
    {
      title: () =>
        renderTitle("Lợi nhuận (VND)", ["categoryRevenueDTO", "profit"], "vnd"),
      dataIndex: ["categoryRevenueDTO", "profit"],
      key: "profit",
      align: "center",
      render: (value) => {
        return <Statistic value={value} precision={0} />;
      },
    },
  ];

  const initialValues =
    params.startDate && params.endDate
      ? {
          data: [
            dayjs(params.startDate, "DD/MM/YYYY"),
            dayjs(params.endDate, "DD/MM/YYYY"),
          ],
        }
      : { data: [dayjs().startOf("month"), dayjs().endOf("month")] };

  const onHandlePagination = (pageCurrent, pageSize) => {
    const params = queryString.parse(location.search);

    const page = pageCurrent.toString();
    const size = pageSize.toString();

    history.push({
      pathname: location.pathname,
      search: queryString.stringify({
        ...params,
        size: size,
        page: page,
        startDate: `${initialValues.data[0].format("DD/MM/YYYY")}`,
        endDate: `${initialValues.data[1].format("DD/MM/YYYY")}`,
      }),
    });
  };

  const handlExportExcel = async () => {
    let query = queryString.parse(location.search);
    if (query.page) {
      query.page = query.page - 1;
    }
    query = {
      ...query,
      startDate: `${initialValues.data[0].format("DD/MM/YYYY")}`,
      endDate: `${initialValues.data[1].format("DD/MM/YYYY")}`,
    };

    try {
      let res = await api.getCategoryProfit(query);
      let dataExport = res.data.content;

      const excel = new Excel();
      excel.addSheet("Lợi nhuận theo Chức năng");

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
        hMerge: 7,
        vMerge: 3,
        value: `Lợi nhuận theo Chức năng : ${query.startDate}-${query.endDate}`,
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

      excel.addColumns(categoryProfitColumnsExport);
      excel.addDataSource(dataExport);

      excel.saveAs(
        `Lợi nhuận theo Chức năng ${query.startDate}-${query.endDate}.xlsx`
      );
    } catch (err) {
      notification.error({
        message: "Lợi nhuận theo Chức năng",
        description: "Xuất dữ liệu không thành công!",
      });
    }
  };

  useEffect(() => {
    setIsLoading(true);

    let query = queryString.parse(location.search);
    if (query.page) {
      query.page = query.page - 1;
    }
    query = {
      ...query,
      startDate: `${initialValues.data[0].format("DD/MM/YYYY")}`,
      endDate: `${initialValues.data[1].format("DD/MM/YYYY")}`,
    };

    dispatch(getCategoryProfit(query))
      .then(unwrapResult)
      .then(() => {
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        if (err.response.status === 400) {
          notification.success({
            message: "Lợi nhuận theo chức năng",
            description: "Tham số không đúng, vui lòng kiểm tra lại",
          });
        }
      });
  }, [dispatch, location]);

  return (
    <div className="category-profit">
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
          rowKey={(record) => record.categoryDTO.id}
          rowClassName={(record, index) =>
            index % 2 === 0
              ? "table-row table-row-even"
              : "table-row table-row-odd"
          }
          scroll={{ x: "maxContent" }}
          columns={columns}
          dataSource={[...listCategoryProfit]}
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
        />
      </motion.div>
    </div>
  );
}
