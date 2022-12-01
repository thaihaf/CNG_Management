import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";

import {
  DeleteTwoTone,
  DownOutlined,
  ExclamationCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Dropdown,
  Form,
  Input,
  Menu,
  Modal,
  notification,
  Space,
  Table,
  Tag,
  Typography,
} from "antd";
import {
  EmployeeManagerPaths,
  getEmployees,
  deleteEmployee,
  deleteEmployees,
} from "features/employee-manager/employeeManager";

import avt_default from "assets/images/avt-default.png";
import "./EmployeeList.css";
const { Title } = Typography;

export default function EmployeeList() {
  const { listEmployees, totalElements, totalPages, size } = useSelector(
    (state) => state.employee
  );
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(2);
  const searchInput = useRef(null);

  const onHandlePagination = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [
      Table.SELECTION_ALL,
      Table.SELECTION_INVERT,
      Table.SELECTION_NONE,
      {
        key: "odd",
        text: "Select Odd Row",
        onSelect: (changableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return false;
            }
            return true;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
      {
        key: "even",
        text: "Select Even Row",
        onSelect: (changableRowKeys) => {
          let newSelectedRowKeys = [];
          newSelectedRowKeys = changableRowKeys.filter((_, index) => {
            if (index % 2 !== 0) {
              return true;
            }
            return false;
          });
          setSelectedRowKeys(newSelectedRowKeys);
        },
      },
    ],
  };

  const onRowDelete = (record) => {
    Modal.confirm({
      title: "Xác nhận",
      icon: <ExclamationCircleOutlined />,
      content: "Bạn chắc chắn muốn xoá không?",
      okText: "Xoá",
      cancelText: "Huỷ bỏ",
      onOk: () => {
        setIsLoading(true);
        dispatch(
          record ? deleteEmployee(record.id) : deleteEmployees(selectedRowKeys)
        )
          .then(unwrapResult)
          .then((res) => {
            console.log(res);
            dispatch(getEmployees())
              .then(unwrapResult)
              .then(() => {
                notification.success({
                  message: "Chức năng",
                  description: "Xoá Chức năng thành công",
                });
                setIsLoading(false);
              });
          })
          .catch((error) => {
            console.log(error);
            notification.error({
              message: "Chức năng",
              description: "Xoá Chức năng thất bại",
            });
          });
      },
      onCancel: () => {},
    });
  };
  const onRowDetails = (record) => {
    history.push(
      EmployeeManagerPaths.EMPLOYEE_DETAILS.replace(
        ":employeeId",
        record.id || ""
      )
    );
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
      title: "Ảnh đại diện",
      dataIndex: "avatar",
      key: "avatar",
      align: "center",
      render: (_, record) => (
        <Avatar
          size={50}
          src={
            record.fileAttachDTO.filePath === ""
              ? avt_default
              : record.fileAttachDTO.filePath
          }
        />
      ),
    },
    {
      title: "Họ",
      dataIndex: "firstName",
      key: "firstName",
      sorter: (a, b) => a.firstName.length - b.firstName.length,
      sortDirections: ["descend", "ascend"],
      ...getColumnSearchProps("firstName"),
    },
    {
      title: "Tên",
      dataIndex: "lastName",
      key: "lastName",
      sorter: (a, b) => a.lastName.length - b.lastName.length,
      sortDirections: ["descend", "ascend"],
      ...getColumnSearchProps("lastName"),
    },
    {
      title: "Giới tính",
      dataIndex: "gender",
      key: "gender",
      align: "center",
      filters: [
        {
          text: "Nam",
          value: true,
        },
        {
          text: "Nữ",
          value: false,
        },
      ],
      onFilter: (value, record) => record.gender == value,
      filterSearch: true,
      render: (s) => (s ? "Nam" : "Nữ"),
      sorter: (a, b) => a.gender.length - b.gender.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      ...getColumnSearchProps("phoneNumber"),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.length - b.email.length,
      sortDirections: ["descend", "ascend"],
      ...getColumnSearchProps("email"),
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
        let color = s == 1 ? "green" : "volcano";
        return s == 1 ? (
          <Tag color={color} key={s}>
            Hoạt động
          </Tag>
        ) : (
          <Tag color={color} key={s}>
            Không hoạt động
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
      render: (_, record) => (
        <Dropdown
          overlay={
            <Menu
              items={[
                {
                  key: 1,
                  label: "Xem Chi tiết và Cập nhật",
                  onClick: () => onRowDetails(record),
                },
                {
                  key: 2,
                  label: "Xoá Nhân viên",
                  onClick: () => onRowDelete(record),
                },
              ]}
            />
          }
        >
          <a>
            Xem thêm <DownOutlined />
          </a>
        </Dropdown>
      ),
    },
  ];
  const hasSelected = selectedRowKeys.length > 0;

  useEffect(() => {
    setIsLoading(true);
    dispatch(getEmployees())
      .then(unwrapResult)
      .then(() => setIsLoading(false));
  }, [dispatch, location]);

  return (
    <div className="employee-list">
      <div className="top">
        <Title level={2}>Danh sách Nhân viên</Title>
        <div>
          <span
            style={{
              marginRight: 9,
            }}
          >
            {hasSelected ? `Đã chọn ${selectedRowKeys.length} mục` : ""}
          </span>
          <Button
            onClick={() => onRowDelete()}
            disabled={!hasSelected}
            loading={isLoading}
            shape="round"
            icon={<DeleteTwoTone twoToneColor="#eb2f96" />}
          >
            Xoá bỏ
          </Button>
        </div>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        loading={isLoading}
        dataSource={listEmployees}
        pagination={
          listEmployees.length !== 0
            ? {
                showSizeChanger: true,
                position: ["bottomCenter"],
                size: "mặc định",
                pageSize: pageSize,
                current: currentPage,
                total: totalElements,
                onChange: (page, size) => onHandlePagination(page, size),
                pageSizeOptions: ["2", "4", "6"],
              }
            : false
        }
        rowSelection={rowSelection}
      />
    </div>
  );
}
