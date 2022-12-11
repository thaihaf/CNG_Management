import { SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Input,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { get } from "lodash";
import Highlighter from "react-highlight-words";
import { ImportProductManagerPaths } from "features/import-product/importProduct";

import "./TableDetails.css";
import dayjs from "dayjs";

const { Option } = Select;
const { Text, Title } = Typography;

export default function TableDetails({ form }) {
  const { listDebtMoney, totalElements, totalPages, size } = useSelector(
    (state) => state.supplierDebt.debtMoney
  );

  const history = useHistory();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const onHandlePagination = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };
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

  const productColumns = [
    {
      title: "Vị trí",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (a, b, index) => <Text>{index + 1}</Text>,
    },
    {
      title: "Ngày",
      dataIndex: "date",
      key: "date",
      align: "center",
      render: (value) => (
        <Tag color="darkseagreen">
          {dayjs(value.split("T")[0], "YYYY/MM/DD").format("DD/MM/YYYY")}
        </Tag>
      ),
    },
    {
      title: "Mã đơn hàng",
      dataIndex: "orderId",
      key: "orderId",
      align: "center",
      render: (value) =>
        value ? (
          <Tooltip title="Chuyển đến đơn nhập">
            <Text
              onClick={() =>
                history.push(
                  ImportProductManagerPaths.DETAILS_PRODUCT_IMPORT.replace(
                    ":importId",
                    value
                  )
                )
              }
              style={{
                color: "#1890ff",
                fontSize: "2rem",
                textDecoration: "underline",
              }}
            >
              {value}
            </Text>
          </Tooltip>
        ) : (
          "--"
        ),
    },
    {
      title: "Phát sinh nợ (vnđ)",
      dataIndex: "debtMoneyDTO",
      key: "incurredIncrease",
      align: "center",
      sorter: (a, b) =>
        parseFloat(a.incurredIncrease) < parseFloat(b.incurredIncrease),
      sortDirections: ["descend", "ascend"],
      render: (value) => (
        <Statistic precision={0} value={value.incurredIncrease} />
      ),
    },
    {
      title: "Phát sinh có (vnđ)",
      dataIndex: "debtMoneyDTO",
      key: "incurredDecrease",
      align: "center",
      sorter: (a, b) => a.incurredDecrease - b.incurredDecrease,
      sortDirections: ["descend", "ascend"],
      render: (value) => (
        <Statistic precision={0} value={value.incurredDecrease} />
      ),
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      align: "center",
      render: (value) => (
        <Input.TextArea
          style={{ height: "100%", resize: "none", minWidth: "150px" }}
          value={value}
          disabled
        />
      ),
    },
  ];

  return (
    <Table
      size="middle"
      className="listProductDetails"
      columns={productColumns}
      dataSource={[...listDebtMoney]}
      rowKey={(record) => record.id}
      loading={isLoading}
      scroll={{ x: "maxContent" }}
      pagination={
        totalElements !== 0
          ? {
              showSizeChanger: true,
              position: ["bottomCenter"],
              size: "default",
              pageSize: size,
              current: currentPage,
              total: totalElements,
              onChange: (page, size) => onHandlePagination(page, size),
              pageSizeOptions: ["2", "4", "10"],
            }
          : false
      }
    />
  );
}
