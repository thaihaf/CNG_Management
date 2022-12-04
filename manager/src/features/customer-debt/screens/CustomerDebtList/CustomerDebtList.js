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
import "./CustomerDebtList.css";

import { get } from "lodash";
import moment from "moment";
import {
  CustomerDebtPaths,
  getCustomerDebts,
} from "features/customer-debt/customerDebt";
import dayjs from "dayjs";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export default function CustomerDebtList() {
  const { listCustomerDebt, totalElements, totalPages, size } = useSelector(
    (state) => state.customerDebt
  );
  const { listActiveCategories } = useSelector((state) => state.category);
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [datesPicker, setDatesPicker] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(2);
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
      title: "Ảnh đại diện",
      key: "image",
      align: "center",
      render: (record) => (
        <Avatar
          size={50}
          src={
            record?.customerDTO.fileAttachDTO.filePath === ""
              ? avt_default
              : record?.customerDTO.fileAttachDTO.filePath
          }
        />
      ),
    },
    {
      title: "Tên khách hàng",
      dataIndex: "customerDTO",
      key: "customerName",
      align: "center",
      render: (value) => {
        return (
          <Text>
            {value.firstName} {value.lastName}
          </Text>
        );
      },
      // ...getColumnSearchProps("id"),
    },
    {
      title: "Tên cửa hàng",
      dataIndex: "customerDTO",
      key: "shopName",
      align: "center",
      render: (value) => {
        return <Text>{value.shopName}</Text>;
      },
      // ...getColumnSearchProps("id"),
    },
    {
      title: "Số điện thoại",
      dataIndex: "customerDTO",
      key: "phoneNumber",
      align: "center",
      render: (value) => {
        return <Text>{value.phoneNumber}</Text>;
      },
    },
    {
      title: "Dư nợ đầu kỳ",
      dataIndex: "debtAtBeginningPeriod",
      key: "debtAtBeginningPeriod",
      align: "center",
      render: (value) => {
        return <Statistic value={value} precision={0} />;
      },
    },
    {
      title: "Phát sinh nợ",
      dataIndex: "debtMoneyDTO",
      key: "debtIncurredIncrease",
      align: "center",
      render: (value) => {
        return <Statistic value={value.incurredIncrease} precision={0} />;
      },
    },
    {
      title: "Phát sinh có",
      dataIndex: "debtMoneyDTO",
      key: "debtIncurredDecrease",
      align: "center",
      render: (value) => {
        return <Statistic value={value.incurredDecrease} precision={0} />;
      },
    },
    {
      title: "Dư nợ cuối kỳ",
      dataIndex: "debtAtEndPeriod",
      key: "debtAtEndPeriod",
      align: "center",
      render: (value) => {
        return <Statistic value={value} precision={0} />;
      },
    },
  ];

  const onHandlePagination = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const handleGetList = async (defaultSelect) => {
    setIsLoading(true);
    let startDate = moment().startOf("month").format("MM/DD/YYYY");
    let endDate = moment().endOf("month").format("MM/DD/YYYY");

    dispatch(
      defaultSelect
        ? getCustomerDebts(datesPicker)
        : getCustomerDebts({ startDate: startDate, endDate: endDate })
    )
      .then(unwrapResult)
      .then(() => {
        setDatesPicker(null);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    handleGetList(false);
  }, [dispatch, location]);

  return (
    <div className="product-list">
      <div className="top">
        <Title level={3} style={{ marginBottom: 0, marginRight: "auto" }}>
          Công nợ Khách hàng
        </Title>

        <RangePicker
          defaultValue={[moment().startOf("month"), moment().endOf("month")]}
          format={"DD/MM/YYYY"}
          onChange={(dates, dateString) => {
            if (dates) {
              let value = {
                startDate: dates[0].format("MM/DD/YYYY"),
                endDate: dates[1].format("MM/DD/YYYY"),
              };
              setDatesPicker(value);
            } else {
              setDatesPicker(null);
            }
          }}
          renderExtraFooter={(value, a, b) => {
            return (
              <Button
                type="primary"
                shape={"round"}
                size={"large"}
                onClick={async () => await handleGetList(true)}
                disabled={datesPicker ? false : true}
              >
                Tìm kiếm
              </Button>
            );
          }}
        />
      </div>

      <Table
        rowKey={(record) => record.customerDTO.id}
        columns={columns}
        loading={isLoading}
        dataSource={[...listCustomerDebt]}
        pagination={
          listCustomerDebt.length !== 0
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
                CustomerDebtPaths.CUSTOMER_DEBT_DETAILS.replace(
                  ":id",
                  record.customerDTO.id
                )
              ),
          };
        }}
      />
    </div>
  );
}
