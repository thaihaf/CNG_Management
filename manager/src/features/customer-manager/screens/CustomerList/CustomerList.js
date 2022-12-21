import React, { useEffect, useRef, useState } from "react";
import queryString from "query-string";
import Highlighter from "react-highlight-words";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { motion } from "framer-motion/dist/framer-motion";

import { ExclamationCircleOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Input,
  Modal,
  Space,
  Table,
  Tag,
  Typography,
  notification,
} from "antd";

import {
  CustomerManagerPaths,
  getCustomers,
  deleteCustomer,
  updateListCustomers,
} from "features/customer-manager/customerManager";
import { CustomerModal } from "features/customer-manager/components";

import avt_default from "assets/images/avt-default.png";
import editImg from "assets/icons/edit.png";
import deleteImg from "assets/icons/delete.png";

import "./CustomerList.css";

const { Title, Text } = Typography;

export default function CustomerList() {
  const { listCustomers, totalElements, page, size } = useSelector(
    (state) => state.customer
  );

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
      pathname: CustomerManagerPaths.CUSTOMER_LIST,
      search: queryString.stringify({
        ...params,
        size: size,
        page: page,
      }),
    });
  };
  const handleDelete = (record) => {
    Modal.confirm({
      title: "Xác nhận",
      icon: <ExclamationCircleOutlined />,
      content: "Bạn chắc chắn muốn xoá không?",
      okText: "Xoá",
      cancelText: "Huỷ bỏ",
      onOk: () => {
        setIsLoading(true);
        dispatch(deleteCustomer(record.id))
          .then(unwrapResult)
          .then((res) => {
            const newListCustomers = listCustomers.map((c) => {
              if (c.id === record.id) {
                return { ...record, status: 0 };
              } else {
                return c;
              }
            });

            dispatch(updateListCustomers(newListCustomers));

            notification.success({
              message: "Khách hàng",
              description: "Xoá Khách hàng thành công",
            });
            setIsLoading(false);
          })
          .catch((error) => {
            console.log(error);
            notification.success({
              message: "Khách hàng",
              description: "Xoá Khách hàng thất bại",
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
  const getColumnSearchProps = (dataIndex) => ({
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
    onFilter: (value, record) =>
      record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
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
      dataIndex: ["fileAttachDTO", "filePath"],
      key: "avatar",
      align: "center",
      align: "center",
      render: (value) => (
        <Avatar size={50} src={value || value !== "" ? value : avt_default} />
      ),
    },
    {
      title: "Tên cửa hàng",
      dataIndex: "shopName",
      key: "shopName",
      align: "center",
      ...getColumnSearchProps("shopName"),
      sorter: (a, b) => a.shopName - b.shopName,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Người liên hệ",
      key: "fullname",
      align: "center",
      render: (record) => `${record.firstName} ${record.lastName}`,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      align: "center",
      ...getColumnSearchProps("phoneNumber"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      filters: [
        {
          text: "Hoạt động",
          value: 1,
        },
        {
          text: "Không hoạt động",
          value: 0,
        },
      ],
      onFilter: (value, record) => record.status === value,
      filterSearch: true,
      render: (s) => {
        let color = s === 1 ? "green" : "volcano";
        return s === 1 ? (
          <Tag color={color} key={s}>
            HOẠT ĐỘNG
          </Tag>
        ) : (
          <Tag color={color} key={s}>
            KHÔNG HOẠT ĐỘNG
          </Tag>
        );
      },
      sorter: (a, b) => a.status - b.status,
      sortDirections: ["descend", "ascend"],
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
            onClick={() =>
              history.push(
                CustomerManagerPaths.CUSTOMER_DETAIL.replace(
                  ":customerId",
                  record.id || ""
                )
              )
            }
          >
            <img
              src={editImg}
              alt="Edit"
              style={{ width: "2.2rem", height: "2.2rem", margin: "auto" }}
            />
          </div>

          {record.status ? (
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
          ) : (
            ""
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    const query = queryString.parse(location.search);
    if (query.page) {
      query.page = query.page - 1;
    }

    setIsLoading(true);
    dispatch(getCustomers(query))
      .then(unwrapResult)
      .then(() => setIsLoading(false));
  }, [dispatch, location]);

  return (
    <div className="cusmtomer-list">
      <motion.div
        className="top"
        animate={{ opacity: [0, 1] }}
        exit={{ opacity: [1, 0] }}
        transition={{ duration: 1 }}
      >
        <Title level={2}>Danh sách Khách hàng</Title>

        <CustomerModal />
      </motion.div>

      <motion.div
        animate={{ opacity: [0, 1], y: [50, 0] }}
        exit={{ opacity: [1, 0] }}
        transition={{ duration: 1 }}
      >
        <Table
          rowKey={(record) => record.id}
          columns={columns}
          rowClassName={(record, index) =>
            index % 2 === 0
              ? "table-row table-row-even"
              : "table-row table-row-odd"
          }
          scroll={{ x: "maxContent" }}
          loading={isLoading}
          dataSource={[...listCustomers]}
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
