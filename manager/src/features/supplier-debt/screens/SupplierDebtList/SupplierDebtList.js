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
  Input,
  notification,
  Space,
  Statistic,
  Table,
  Typography,
} from "antd";

import avt_default from "assets/images/avt-default.png";
import "./SupplierDebtList.css";

import { get } from "lodash";

import {
  getSupplierDebts,
  SupplierDebtPaths,
} from "features/supplier-debt/supplierDebt";
import dayjs from "dayjs";
import { motion } from "framer-motion/dist/framer-motion";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

export default function SupplierDebtList() {
  const { listSupplierDebt, totalElements, page, size } = useSelector(
    (state) => state.supplierDebt
  );
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();

  const params = queryString.parse(location.search);
  const [isLoading, setIsLoading] = useState(false);
  const [datesPicker, setDatesPicker] = useState(null);

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
      title: "Ảnh đại diện",
      key: "image",
      align: "center",
      render: (record) => (
        <Avatar
          size={50}
          src={
            record?.supplierDTO.avatarSupplier === ""
              ? avt_default
              : record?.supplierDTO.avatarSupplier
          }
        />
      ),
    },
    {
      title: "Nhà cung cấp",
      dataIndex: "supplierDTO",
      key: "shopName",
      align: "center",
      render: (value) => {
        return <Text>{value.supplierName}</Text>;
      },
      // ...getColumnSearchProps("id"),
    },
    {
      title: "Người liên hệ",
      dataIndex: "supplierDTO",
      key: "supplierName",
      align: "center",
      render: (value) => {
        return (
          <Text>
            {value.firstContactName} {value.lastContactName}
          </Text>
        );
      },
      // ...getColumnSearchProps("id"),
    },
    {
      title: "Số điện thoại",
      dataIndex: "supplierDTO",
      key: "phoneNumberContact",
      align: "center",
      render: (value) => {
        return <Text>{value.phoneNumberContact}</Text>;
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

  const defaultValue =
    params.startDate && params.endDate
      ? [
          dayjs(params.startDate, "DD/MM/YYYY"),
          dayjs(params.endDate, "DD/MM/YYYY"),
        ]
      : [dayjs().startOf("month"), dayjs().endOf("month")];

  const onHandlePagination = (pageCurrent, pageSize) => {
    const params = queryString.parse(location.search);
    const page = pageCurrent.toString();
    const size = pageSize.toString();
    const startDate = datesPicker
      ? datesPicker.startDate
      : dayjs().startOf("month").format("DD/MM/YYYY");
    const endDate = datesPicker
      ? datesPicker.endDate
      : dayjs().endOf("month").format("DD/MM/YYYY");

    history.push({
      pathname: SupplierDebtPaths.SUPPLIER_DEBT_MANAGER,
      search: queryString.stringify({
        ...params,
        size: size,
        page: page,
        startDate: startDate,
        endDate: endDate,
      }),
    });
  };
  const onHandleSearch = () => {
    const params = queryString.parse(location.search);

    history.push({
      pathname: SupplierDebtPaths.SUPPLIER_DEBT_MANAGER,
      search: queryString.stringify({
        ...params,
        startDate: datesPicker.startDate,
        endDate: datesPicker.endDate,
      }),
    });
  };

  useEffect(() => {
    setIsLoading(true);

    let query = queryString.parse(location.search);
    if (query.page) {
      query.page = query.page - 1;
    }
    query = {
      ...query,
      startDate: defaultValue[0].format("DD/MM/YYYY"),
      endDate: defaultValue[1].format("DD/MM/YYYY"),
    };

    dispatch(getSupplierDebts(query))
      .then(unwrapResult)
      .then(() => {
        setIsLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setIsLoading(false);
        if (err.response.status === 400) {
          notification.success({
            message: "Công nợ Nhà cung cấp",
            description: "Tham số không đúng, vui lòng kiểm tra lại",
          });
        }
      });
  }, [dispatch, location]);

  return (
    <div className="supplier-debt-list">
      <motion.div
        className="top"
        animate={{ opacity: [0, 1] }}
        exit={{ opacity: [1, 0] }}
        transition={{ duration: 1 }}
      >
        <Title level={3} style={{ marginBottom: 0, marginRight: "auto" }}>
          Công nợ Nhà cung cấp
        </Title>

        <RangePicker
          defaultValue={
            defaultValue[0].format("DD/MM/YYYY") !== "Invalid Date" &&
            defaultValue[1].format("DD/MM/YYYY") !== "Invalid Date"
              ? defaultValue
              : null
          }
          format="DD/MM/YYYY"
          onChange={(dates, dateStrings) => {
            if (dates) {
              setDatesPicker({
                startDate: dateStrings[0],
                endDate: dateStrings[1],
              });
            }
          }}
        />

        <Button
          type="primary"
          shape={"round"}
          onClick={() => onHandleSearch()}
          style={{ marginLeft: "1rem", width: "15rem", height: "3.8rem" }}
        >
          Tìm kiếm
        </Button>
      </motion.div>

      <motion.div
        animate={{ opacity: [0, 1], y: [50, 0] }}
        exit={{ opacity: [1, 0] }}
        transition={{ duration: 1 }}
      >
        <Table
          rowKey={(record) => record.supplierDTO.id}
          columns={columns}
          loading={isLoading}
          scroll={{ x: "maxContent" }}
          rowClassName={(record, index) =>
            index % 2 === 0
              ? "table-row table-row-even"
              : "table-row table-row-odd"
          }
          dataSource={[...listSupplierDebt]}
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
          onRow={(record) => {
            return {
              onClick: () =>
                history.push(
                  SupplierDebtPaths.SUPPLIER_DEBT_DETAILS.replace(
                    ":id",
                    record.supplierDTO.id
                  )
                ),
            };
          }}
        />
      </motion.div>
    </div>
  );
}
