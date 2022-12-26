import {
  CaretDownFilled,
  CaretUpFilled,
  DownOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Dropdown,
  Form,
  Input,
  Menu,
  message,
  Modal,
  notification,
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
import queryString from "query-string";

import deleteImg from "assets/icons/delete.png";
import editImg from "assets/icons/edit.png";

import "./TableDetails.css";
import DetailsModal from "../DetailsModal/DetailsModal";
import {
  deleteDetailsProduct,
  updateProductDetails,
} from "features/product-manager/productManager";
import { unwrapResult } from "@reduxjs/toolkit";
import {
  CustomerManagerPaths,
  deleteDeptCustomer,
  getDebtCustomers,
  updateDebtCustomers,
} from "features/customer-manager/customerManager";

const { Option } = Select;
const { Text, Title } = Typography;

export default function TableDetails({ form }) {
  const { listDebtCustomer, totalElements, page, size } = useSelector(
    (state) => state.customer.debtCustomer
  );

  const paramsDetails = useParams();
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const onHandlePagination = (pageCurrent, pageSize) => {
    setIsLoading(true);

    const page = pageCurrent.toString();
    const size = pageSize.toString();
    const params = queryString.parse(location.search);

    history.push({
      pathname: CustomerManagerPaths.CUSTOMER_DETAIL.replace(
        ":customerId",
        paramsDetails.customerId || ""
      ),
      search: queryString.stringify({
        ...params,
        size: size,
        page: page,
      }),
    });
  };
  const handleDelete = (record) => {
    Modal.confirm({
      title: "Xoá Khoản thanh toán",
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn xoá Khoản thanh toán không?`,
      okText: "Xoá bỏ",
      cancelText: "Huỷ bỏ",
      onOk: () => {
        setIsLoading(true);
        dispatch(deleteDeptCustomer(record?.id))
          .then(unwrapResult)
          .then((res) => {
            let ab = listDebtCustomer.filter((item) => item.id !== record?.id);
            dispatch(updateDebtCustomers(ab));
            setIsLoading(false);
            notification.success({
              message: "Khoản thanh toán",
              description: "Xoá Khoản thanh toán thành công!",
            });
          })
          .catch((error) => {
            setIsLoading(false);
            notification.error({
              message: "Khoản thanh toán",
              description: "Xoá Khoản thanh toán thất bại",
            });
          });
      },
      onCancel: () => {},
    });
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
          placeholder={`Tìm kiếm ${dataIndex}`}
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
            Tìm kiếm
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
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (a, b, index) => <Text>{index + 1}</Text>,
    },
    {
      title: "Ngày tạo",
      dataIndex: "debtDay",
      key: "debtDay",
      align: "center",
    },
    {
      title: "Số tiền Thanh toán",
      dataIndex: "paymentAmount",
      key: "paymentAmount",
      align: "center",
      sorter: (a, b) =>
        parseFloat(a.paymentAmount) < parseFloat(b.paymentAmount),
      sortDirections: ["descend", "ascend"],
      render: (value) => {
        return <Statistic value={value} precision={0} />;
      },
    },
    {
      title: "Loại Thanh toán",
      dataIndex: "paymentType",
      key: "paymentType",
      align: "center",
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      align: "center",
      render: (value) => (!value || value === "" ? "--" : value),
    },
    {
      title: "Hành động",
      dataIndex: "operation",
      key: "operation",
      align: "center",
      render: (_, record) => (
        <div
          style={{
            display: "flex",
            alignItem: "center",
            justifyContent: "center",
            gap: "2rem",
          }}
        >
          <DetailsModal record={record} updateMode={true} />
          <div
            style={{
              width: "4rem",
              height: "4rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              borderRadius: "50%",
              background: "#eaf0f6",
            }}
            onClick={() => handleDelete(record)}
          >
            <img
              src={deleteImg}
              alt="delete"
              style={{
                width: " 1.4rem",
                height: " 1.5rem",
                margin: "auto",
                cursor: "pointer",
              }}
            />
          </div>
        </div>
      ),
    },
  ];

  useEffect(() => {
    const query = queryString.parse(location.search);
    if (query.page) {
      query.page = query.page - 1;
    }

    dispatch(getDebtCustomers({ id: paramsDetails.customerId, params: query }))
      .then(unwrapResult)
      .then(() => {
        setIsLoading(false);
      });
  }, [dispatch, location]);

  return (
    <Table
      bordered
      rowClassName={(record, index) =>
        index % 2 === 0 ? "table-row table-row-even" : "table-row table-row-odd"
      }
      className="customer-table-details"
      columns={columns}
      dataSource={[...listDebtCustomer]}
      rowKey={(record) => record.id}
      loading={isLoading}
      scroll={{ x: "maxContent" }}
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
  );
}
