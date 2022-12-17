import React, { useEffect, useRef, useState } from "react";
import Highlighter from "react-highlight-words";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import queryString from "query-string";
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
  updateListEmployees,
} from "features/employee-manager/employeeManager";

import editImg from "assets/icons/edit.png";
import deleteImg from "assets/icons/delete.png";
import avt_default from "assets/images/avt-default.png";

import "./EmployeeList.css";
const { Title, Text } = Typography;

export default function EmployeeList() {
  const { listEmployees, totalElements, number, size } = useSelector(
    (state) => state.employee
  );
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

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
      pathname: EmployeeManagerPaths.EMPLOYEE_MANAGER,
      search: queryString.stringify({
        ...params,
        size: size,
        number: page,
      }),
    });
  };

  const onRowDelete = (record) => {
    Modal.confirm({
      title: "Xác nhận",
      icon: <ExclamationCircleOutlined />,
      content: "Bạn chắc chắn muốn xoá Nhân viên không?",
      okText: "Xoá",
      cancelText: "Huỷ bỏ",
      onOk: () => {
        setIsLoading(true);
        dispatch(deleteEmployee(record.id))
          .then(unwrapResult)
          .then((res) => {
            const newListEmployees = listEmployees.map((c) => {
              if (c.id === record.id) {
                return { ...record, status: 0 };
              } else {
                return c;
              }
            });

            dispatch(updateListEmployees(newListEmployees));

            notification.success({
              message: "Nhân viên",
              description: "Xoá Nhân viên thành công",
            });
            setIsLoading(false);
          })
          .catch((error) => {
            console.log(error);
            notification.error({
              message: "Nhân viên",
              description: "Xoá Nhân viên thất bại",
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
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (a, b, index) => <Text>{index + 1}</Text>,
    },
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
      title: "Họ và tênf",
      key: "fullName",
      align: "center",
      render: (record) => `${record.firstName} ${record.lastName}`,
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
      align: "center",
      ...getColumnSearchProps("phoneNumber"),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      align: "center",
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
          <img
            src={editImg}
            alt=""
            style={{ width: "2.3rem", height: "2.3rem", cursor: "pointer" }}
            onClick={() => onRowDetails(record)}
          />
          {record.status ? (
            <img
              src={deleteImg}
              alt=""
              style={{ width: "3rem", height: "3rem", cursor: "pointer" }}
              onClick={() => onRowDelete(record)}
            />
          ) : (
            ""
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    let query = queryString.parse(location.search);
    if (query.number) {
      query.number = query.number - 1;
    }

    setIsLoading(true);
    dispatch(getEmployees(query))
      .then(unwrapResult)
      .then(() => setIsLoading(false));
  }, [dispatch, location]);

  return (
    <div className="employee-list">
      <div className="top">
        <Title level={2}>Danh sách Nhân viên</Title>
      </div>

      <Table
        rowKey={(record) => record.id}
        columns={columns}
        loading={isLoading}
        dataSource={[...listEmployees]}
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
