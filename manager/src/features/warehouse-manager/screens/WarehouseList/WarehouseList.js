import React, { useEffect, useRef, useState } from "react";
import queryString from "query-string";
import Highlighter from "react-highlight-words";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { DownOutlined } from "@ant-design/icons";
import {
  DeleteTwoTone,
  ExclamationCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Space,
  Table,
  Tag,
  Typography,
  Dropdown,
  Menu,
  Select,
  notification,
} from "antd";
import {
  WarehouseManagerPaths,
  getWarehouses,
  deleteWarehouse,
  deleteWarehouses,
  updateListWarehouses,
} from "features/warehouse-manager/warehouseManager";
import "./WarehouseList.css";
import { CODE_ERROR } from "constants/errors.constants";
import { MESSAGE_ERROR } from "constants/messages.constants";
import { getMessage } from "helpers/util.helper";

import { createDetails } from "features/warehouse-manager/warehouseManager";
import {
  getDistrict,
  getProvince,
  getProvinces,
} from "features/provinces/provinces";

import deleteImg from "assets/icons/delete.png";
import { WarehouseModal } from "features/warehouse-manager/components";

const { Title, Text } = Typography;
const { Option } = Select;

export default function WarehouseList() {
  const { listWarehouses, totalElements, number, size } = useSelector(
    (state) => state.warehouse
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
      pathname: WarehouseManagerPaths.WAREHOUSE_LIST,
      search: queryString.stringify({
        ...params,
        size: size,
        number: page,
      }),
    });
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "Xác nhận",
      icon: <ExclamationCircleOutlined />,
      content: "Bạn chắc chắn muốn xoá không?",
      okText: "Xoá bỏ",
      cancelText: "Huỷ bỏ",
      onOk: () => {
        setIsLoading(true);
        dispatch(deleteWarehouse(record.id))
          .then(unwrapResult)
          .then((res) => {
             const newListWarehouses = listWarehouses.map((c) => {
               if (c.id === record.id) {
                 return { ...record, status: 0 };
               } else {
                 return c;
               }
             });

             dispatch(updateListWarehouses(newListWarehouses));

            notification.success({
              message: "Xoá Kho",
              description: "Xoá Kho thành công",
            });
            setIsLoading(false);
          })
          .catch((error) => {
            notification.error({
              message: "Xoá Kho",
              description: "Xoá Kho thất bại",
            });
            setIsLoading(false);
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
      title: "Tên Kho",
      dataIndex: "warehouseName",
      key: "warehouseName",
      align: "center",
      ...getColumnSearchProps("warehouseName"),
      sorter: (a, b) => a.warehouseName - b.warehouseName,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      align: "center",
      ...getColumnSearchProps("phoneNumber"),
      sorter: (a, b) => a.phoneNumber.length - b.phoneNumber.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Ghi chú",
      dataIndex: "noteWarehouse",
      key: "noteWarehouse",
      align: "center",
      ...getColumnSearchProps("noteWarehouse"),
      sorter: (a, b) => a.noteWarehouse - b.noteWarehouse,
      sortDirections: ["descend", "ascend"],
      render: (value, record, index) => (value === "" || !value ? "--" : value),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
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
      align: "center",
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
          <WarehouseModal data={record} />
          {record.status ? (
            <img
              src={deleteImg}
              alt=""
              style={{ width: "3rem", height: "3rem", cursor: "pointer" }}
              onClick={() => handleDelete(record)}
            />
          ) : (
            ""
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    const query = queryString.parse(location.search);
    if (query.number) {
      query.number = query.number - 1;
    }
    setIsLoading(true);
    dispatch(getWarehouses(query))
      .then(unwrapResult)
      .then(() => setIsLoading(false));
  }, [dispatch, location]);

  return (
    <div className="warehouse-list">
      <div className="top">
        <Title level={2}>Danh sách Kho</Title>

        <WarehouseModal />
      </div>
      <Table
        rowKey={(record) => record.id}
        columns={columns}
        loading={isLoading}
        dataSource={[...listWarehouses]}
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
      />
    </div>
  );
}
