import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";

import { SearchOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  DatePicker,
  Input,
  Space,
  Statistic,
  Table,
  Typography,
} from "antd";

import avt_default from "assets/images/avt-default.png";
import "./ProductsExpande.css";

import { get } from "lodash";
import dayjs from "dayjs";

import { getDashboardCustomerDaily } from "features/dashboard/dashboard";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export default function ProductsExpande({ listProductsExpande }) {
  const history = useHistory();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
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
      title: "Vị trí",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (a, b, index) => <Text>{index + 1}</Text>,
    },
    {
      title: "Mã sản phẩm",
      dataIndex: "productDetailDTO",
      key: "productId",
      align: "center",
      render: (value) => {
        return <Text>{value.productId}</Text>;
      },
      // ...getColumnSearchProps("id"),
    },
    {
      title: "Số lô",
      dataIndex: "productDetailDTO",
      key: "shipment",
      align: "center",
      render: (value) => {
        return <Text>{value.shipment}</Text>;
      },
      // ...getColumnSearchProps("id"),
    },
    {
      title: "Loại sản phẩm",
      dataIndex: "productDetailDTO",
      key: "type",
      align: "center",
      render: (value) => {
        return <Text>{value.type}</Text>;
      },
      // ...getColumnSearchProps("id"),
    },
    {
      title: "Số lượng (m2)",
      dataIndex: "totalSquareMeter",
      key: "totalSquareMeter",
      align: "center",
      render: (value) => {
        return <Text>{value}</Text>;
      },
      // ...getColumnSearchProps("id"),
    },
    {
      title: "Đơn giá nhập (vnđ)",
      dataIndex: "costPerSquareMeter",
      key: "costPerSquareMeter",
      align: "center",
      render: (value) => {
        return <Text>{value}</Text>;
      },
      // ...getColumnSearchProps("id"),
    },
    {
      title: "Đơn giá bán (vnđ)",
      dataIndex: "pricePerSquareMeter",
      key: "pricePerSquareMeter",
      align: "center",
      render: (value) => {
        return <Text>{value}</Text>;
      },
      // ...getColumnSearchProps("id"),
    },
    {
      title: "Thành tiền (vnđ)",
      dataIndex: "totalPrice",
      key: "totalPrice",
      align: "center",
      render: (value) => {
        return <Statistic value={value} precision={0} />;
      },
    },
    {
      title: "Lợi nhuận (vnđ)",
      dataIndex: "revenue",
      key: "revenue",
      align: "center",
      render: (value) => {
        return <Statistic value={value} precision={0} />;
      },
    },
  ];

  return (
    <Table
      rowKey={(record) => record.id}
      columns={columns}
      loading={isLoading}
      dataSource={[...listProductsExpande]}
      pagination={false}
      className="productsExpande"
    />
  );
}
