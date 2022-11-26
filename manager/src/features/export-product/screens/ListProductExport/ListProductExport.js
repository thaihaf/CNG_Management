import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import moment from "moment";

import { SearchOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Input,
  message,
  Space,
  Statistic,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";

import avt_default from "assets/images/avt-default.png";
import "./ListProductExport.css";

import {
  getProducts,
  ProductManagerPaths,
  titleSizeList,
} from "features/product-manager/productManager";
import { getActiveCategories } from "features/category-manager/categoryManager";
import { get } from "lodash";
import { ActionsModal } from "features/product-manager/components";

import { getStatusString } from "helpers/util.helper";
import { statusProductExport } from "features/export-product/constants/export-product.constants";
import {
  getAllProductExport,
  ProductExportManagerPaths,
} from "features/export-product/exportProduct";

const { Title, Text } = Typography;

export default function ListProductExport() {
  const { listAllProductExport, totalElements, totalPages, size } = useSelector(
    (state) => state.productExport
  );
  const { listActiveCategories } = useSelector((state) => state.category);
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);

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
      if (typeof record[dataIndex] !== "object") {
        return record[dataIndex]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase());
      } else {
        if (typeof nestedValue === "string") {
          return get(record, dataIndex)
            [nestedValue].toString()
            .toLowerCase()
            .includes(value.toLowerCase());
        } else {
          let parent = get(record, dataIndex);
          let data = nestedValue.reduce(
            (previousValue, currentValue) =>
              previousValue + " " + parent[currentValue],
            ""
          );
          return data.toString().toLowerCase().includes(value.toLowerCase());
        }
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
      title: "Index",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (a, b, index) => <Text>{index + 1}</Text>,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      align: "center",
      ...getColumnSearchProps("type"),
      render: (_, { type }) => (
        <Tag color="darkseagreen" key={type}>
          {type}
        </Tag>
      ),
    },
    {
      title: "Create Date",
      dataIndex: "createAt",
      key: "createAt",
      align: "center",
      sorter: (a, b) => moment(a.createAt).isAfter(b.createAt),
      sortDirections: ["descend", "ascend"],
      render: (_, { createDate }) => {
        let newDate = moment(new Date(createDate)).format("DD-MM-YYYY");
        return <Text>{newDate}</Text>;
      },
    },
    {
      title: "License Plates",
      dataIndex: "licensePlates",
      key: "licensePlates",
      align: "center",
      ...getColumnSearchProps("licensePlates"),
    },
    {
      title: "Total Quantity",
      dataIndex: "totalQuantityExport",
      key: "totalQuantityExport",
      align: "center",
      sorter: (a, b) => a.totalQuantityExport > b.totalQuantityExport,
      sortDirections: ["descend", "ascend"],
      render: (a, { totalQuantityExport }) => {
        return <Statistic value={totalQuantityExport} />;
      },
    },
    {
      title: "Total Square Meter",
      dataIndex: "totalSquareMeterExport",
      key: "totalSquareMeterExport",
      align: "center",
      sorter: (a, b) =>
        parseFloat(a.totalSquareMeterExport) <
        parseFloat(b.totalSquareMeterExport),
      sortDirections: ["descend", "ascend"],
      render: (a, { totalSquareMeterExport }) => {
        return <Statistic precision={2} value={totalSquareMeterExport} />;
      },
    },
    {
      title: "Total Order Price",
      dataIndex: "totalExportOrderPrice",
      key: "totalExportOrderPrice",
      align: "center",
      sorter: (a, b) =>
        parseFloat(a.totalExportOrderPrice) >
        parseFloat(b.totalExportOrderPrice),
      sortDirections: ["descend", "ascend"],
      render: (a, { totalExportOrderPrice }) => {
        return <Statistic precision={2} value={totalExportOrderPrice} />;
      },
    },
    {
      title: "Customer",
      dataIndex: "customerId",
      key: "customerId",
      align: "center",
      ...getColumnSearchProps("customerId"),
      render: (_, { customerId, customerName }) => (
        <Tag color="blue" key={customerId}>
          {customerName}
        </Tag>
      ),
    },
    {
      title: "Employee",
      dataIndex: "employeeId",
      key: "employeeId",
      align: "center",
      ...getColumnSearchProps("employeeId"),
      render: (_, { employeeId, employeeName }) => (
        <Tag color="blue" key={employeeId}>
          {employeeName}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      filters: statusProductExport.map((item) => {
        return { key: item.key, value: item.value, text: item.label };
      }),
      onFilter: (value, record) => record.status === value,
      filterSearch: true,
      render: (s) => {
        // let color = s == 1 ? "green" : "volcano";

        return (
          <Tag color="green" key={s}>
            {getStatusString(s)}
          </Tag>
        );
      },
      sorter: (a, b) => a.status - b.status,
      sortDirections: ["descend", "ascend"],
    },
  ];

  const onHandlePagination = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  useEffect(() => {
    setIsLoading(true);

    dispatch(getAllProductExport())
      .then(unwrapResult)
      .then((res) => {
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        // message.error(err.response.data.Error.message);
        setIsLoading(false);
      });

    // dispatch(getActiveCategories());
  }, [dispatch, location]);

  return (
    <div className="product-list">
      <div className="top">
        <Title level={2} style={{ cursor: "pointer" }}>
          Product Export List
        </Title>

        <Button
          type="primary"
          shape={"round"}
          size={"large"}
          onClick={() =>
            history.push(ProductExportManagerPaths.CREATE_PRODUCT_EXPORT)
          }
        >
          Create New
        </Button>
      </div>

      <Table
        size="large"
        rowKey="id"
        columns={columns}
        loading={isLoading}
        dataSource={listAllProductExport}
        pagination={
          listAllProductExport.length !== 0
            ? {
                showSizeChanger: true,
                position: ["bottomCenter"],
                size: "default",
                pageSize: pageSize,
                current: currentPage,
                totalElements,
                onChange: (page, size) => onHandlePagination(page, size),
                pageSizeOptions: ["2", "4", "6"],
              }
            : false
        }
        onRow={(record) => {
          return {
            onClick: () =>
              history.push(
                ProductExportManagerPaths.DETAILS_PRODUCT_EXPORT.replace(
                  ":exportId",
                  record.id
                )
              ),
          };
        }}
      />
    </div>
  );
}