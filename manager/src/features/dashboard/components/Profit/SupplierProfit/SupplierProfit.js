import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import queryString from "query-string";

import { SearchOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  DatePicker,
  Form,
  Input,
  notification,
  Radio,
  Space,
  Statistic,
  Table,
  Typography,
} from "antd";

import avt_default from "assets/images/avt-default.png";
import "./SupplierProfit.css";

import { get } from "lodash";

import {
  getSupplierDebts,
  SupplierDebtPaths,
} from "features/supplier-debt/supplierDebt";
import dayjs from "dayjs";
import { getMessage } from "helpers/util.helper";
import { CODE_ERROR } from "constants/errors.constants";
import { MESSAGE_ERROR } from "constants/messages.constants";
import {
  DashboardPaths,
  getProductProfit,
  getSupplierProfit,
} from "features/dashboard/dashboard";

const { Title, Text } = Typography;

export default function SupplierProfit() {
  const { listSupplierProfit, totalElements, number, size } = useSelector(
    (state) => state.dashboard.supplierProfit
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

  const columns = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (a, b, index) => <Text>{index + 1}</Text>,
    },
    {
      title: "Tên nhà cung cấp",
      dataIndex: ["supplierDTO", "supplierName"],
      key: "supplierName",
      align: "center",
    },
    {
      title: "Số lượng m2 xuất",
      dataIndex: ["supplierRevenueDTO", "squareMeterExport"],
      key: "squareMeterExport",
      align: "center",
    },
    {
      title: "Số lượng m2 nhập lại",
      dataIndex: ["supplierRevenueDTO", "squareMeterReExport"],
      key: "squareMeterReExport",
      align: "center",
    },
    {
      title: "Tiền nhập",
      dataIndex: ["supplierRevenueDTO", "totalCostImport"],
      key: "totalCostImport",
      align: "center",
    },
    {
      title: "Tiền nhập lại",
      dataIndex: ["supplierRevenueDTO", "totalPriceReExport"],
      key: "totalPriceReExport",
      align: "center",
    },
    {
      title: "Doanh số",
      dataIndex: ["supplierRevenueDTO", "totalPriceExport"],
      key: "totalPriceExport",
      align: "center",
    },
    {
      title: "Lợi nhuận",
      dataIndex: ["supplierRevenueDTO", "profit"],
      key: "profit",
      align: "center",
    },
  ];
  const columnsSupplierProfit = [
    {
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (a, b, index) => <Text>{index + 1}</Text>,
    },
    {
      title: "Tên nhãn hàng",
      dataIndex: ["brandDTO", "brandName"],
      key: "brandName",
      align: "center",
    },
    {
      title: "Số lượng m2 xuất",
      dataIndex: ["brandRevenueDTO", "squareMeterExport"],
      key: "squareMeterExport",
      align: "center",
    },
    {
      title: "Số lượng m2 nhập lại",
      dataIndex: ["brandRevenueDTO", "squareMeterReExport"],
      key: "squareMeterReExport",
      align: "center",
    },
    {
      title: "Tiền nhập",
      dataIndex: ["brandRevenueDTO", "totalCostImport"],
      key: "totalCostImport",
      align: "center",
    },
    {
      title: "Tiền nhập lại",
      dataIndex: ["brandRevenueDTO", "totalPriceReExport"],
      key: "totalPriceReExport",
      align: "center",
    },
    {
      title: "Doanh số",
      dataIndex: ["brandRevenueDTO", "totalPriceExport"],
      key: "totalPriceExport",
      align: "center",
    },
    {
      title: "Lợi nhuận",
      dataIndex: ["brandRevenueDTO", "profit"],
      key: "profit",
      align: "center",
      // render: (value) => {
      //   return <Statistic value={value} precision={0} />;
      // },
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
        number: page,
        startDate: `${initialValues.data[0].format("DD/MM/YYYY")}`,
        endDate: `${initialValues.data[1].format("DD/MM/YYYY")}`,
      }),
    });
  };

  useEffect(() => {
    setIsLoading(true);

    let query = queryString.parse(location.search);
    if (query.number) {
      query.number = query.number - 1;
    }
    query = {
      ...query,
      startDate: `${initialValues.data[0].format("DD/MM/YYYY")}`,
      endDate: `${initialValues.data[1].format("DD/MM/YYYY")}`,
    };

    dispatch(getSupplierProfit(query))
      .then(unwrapResult)
      .then(() => {
        setIsLoading(false);
      })
      .catch((err) => {
        setIsLoading(false);
        if (err.response.status === 400) {
          notification.success({
            message: "Lợi nhuận theo nhà cung cấp",
            description: "Tham số không đúng, vui lòng kiểm tra lại",
          });
        }
      });
  }, [dispatch, location]);

  return (
    <div className="supplier-inventory">
      <div className="top">
        <Title level={5} style={{ marginBottom: 0 }}>
          Xuất dữ liệu
        </Title>

        <Radio.Group onChange={(e) => setTabPosition(e.target.value)}>
          <Radio.Button value="excel">Excel</Radio.Button>
          <Radio.Button value="csv">CSV</Radio.Button>
          <Radio.Button value="pdf">PDF</Radio.Button>
          <Radio.Button value="print">Print</Radio.Button>
        </Radio.Group>
      </div>

      <Table
        rowKey={(record) => record.supplierDTO.id}
        columns={columns}
        loading={isLoading}
        dataSource={[...listSupplierProfit]}
        pagination={
          totalElements !== 0
            ? {
                current: number,
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
            record.brandRevenueDTOS && (
              <Table
                bordered
                loading={isLoading}
                columns={columnsSupplierProfit}
                rowKey={(record) => record.brandDTO.id}
                dataSource={[...record.brandRevenueDTOS]}
                pagination={false}
                className="productsExpande"
              />
            ),
        }}
      />
    </div>
  );
}
