import React, { useEffect, useRef, useState } from "react";
import queryString from "query-string";
import Highlighter from "react-highlight-words";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { motion } from "framer-motion/dist/framer-motion";

import { SearchOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  notification,
  Space,
  Spin,
  Table,
  Tag,
  Typography,
} from "antd";

import "./AccountList.css";
import { CODE_ERROR } from "constants/errors.constants";
import { MESSAGE_ERROR } from "constants/messages.constants";
import { getMessage } from "helpers/util.helper";
import {
  createAccEmployee,
  EmployeeManagerPaths,
  getAccounts,
} from "features/employee-manager/employeeManager";

import editImg from "assets/icons/edit.png";
import deleteImg from "assets/icons/delete.png";
import avt_default from "assets/images/avt-default.png";

const { Title, Text } = Typography;

export default function AccountList() {
  const { listAccounts, totalElements, number, size } = useSelector(
    (state) => state.employee
  );
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const [modal1Open, setModal1Open] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingModal, setIsLoadingModal] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const onHandlePagination = (pageCurrent, pageSize) => {
    setIsLoading(true);

    const page = pageCurrent.toString();
    const size = pageSize.toString();
    const params = queryString.parse(location.search);

    history.push({
      pathname: EmployeeManagerPaths.ACCOUNT_LIST,
      search: queryString.stringify({
        ...params,
        size: size,
        number: page,
      }),
    });
  };

  useEffect(() => {
    const query = queryString.parse(location.search);
    if (query.number) {
      query.number = query.number - 1;
    }

    setIsLoading(true);
    dispatch(getAccounts(query))
      .then(unwrapResult)
      .then(() => setIsLoading(false));
  }, [dispatch, location]);

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
      title: "Tên đăng nhập",
      dataIndex: "username",
      key: "username",
      align: "center",
      sorter: (a, b) => a.username.length - b.username.length,
      sortDirections: ["descend", "ascend"],
      ...getColumnSearchProps("username"),
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
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      align: "center",
      filters: [
        {
          text: "Quản lý",
          value: "ROLE_ADMIN",
        },
        {
          text: "Nhân viên",
          value: "ROLE_EMPLOYEE",
        },
      ],
      onFilter: (value, record) => record.role == value,
      filterSearch: true,
      render: (s) => (s === "ROLE_ADMIN" ? "ADMIN" : "EMPLOYEE"),
      sorter: (a, b) => a.role.length - b.role.length,
      sortDirections: ["descend", "ascend"],
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
          text: "Không Hoạt động",
          value: 0,
        },
      ],
      onFilter: (value, record) => record.status === value,
      filterSearch: true,
      render: (s) => {
        let color = s == 1 ? "green" : "volcano";
        return s == 1 ? (
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
              // onClick={() => onRowDelete(record)}
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

  const onSubmitCreate = ({ rePassword, ...params }) => {
    setIsLoadingModal(true);
    dispatch(createAccEmployee({ data: { ...params, role: "ROLE_EMPLOYEE" } }))
      .then(unwrapResult)
      .then(({ data }) => {
        if (data === true) {
          const query = queryString.parse(location.search);
          if (query.number) {
            query.number = query.number - 1;
          }

          dispatch(getAccounts({ ...query, sort: "createAt,desc" }))
            .then(unwrapResult)
            .then(() => {
              notification.success({
                message: "Tài khoản",
                description: "Tạo tài khoản Nhân viên mới thành công",
              });
              form.resetFields();
              setModal1Open(false);
              setIsLoadingModal(false);
            });
        } else {
          notification.success({
            message: "Tài khoản",
            description: data.Error.message,
          });
        }
      })
      .catch((error) => {
        notification.error({
          message: "Đăng nhập",
          description: error?.Error?.message || "Lỗi rồi!!!",
        });
        // dispatch(updateErrorProcess(CODE_ERROR.ERROR_CREATE));
      });
  };

  return (
    <div className="account-list">
      <motion.div
        className="top"
        animate={{ opacity: [0, 1] }}
        exit={{ opacity: [1, 0] }}
        transition={{ duration: 1 }}
      >
        <Title level={2}>Danh sách Tài khoản</Title>

        <Button
          type="primary"
          shape={"round"}
          onClick={() => setModal1Open(true)}
          style={{ width: "15rem", height: "3.8rem" }}
        >
          Tạo Tài khoản
        </Button>

        <Modal
          title="Tạo Tài khoản mới"
          style={{ top: 20 }}
          open={modal1Open}
          onOk={() => setModal1Open(false)}
          onCancel={() => setModal1Open(false)}
          footer={[]}
        >
          <Spin spinning={isLoadingModal}>
            <Form
              form={form}
              labelCol={{
                span: 4,
              }}
              wrapperCol={{
                span: 14,
              }}
              layout="horizontal"
              name="form"
              colon={false}
              onFinish={onSubmitCreate}
            >
              <div className="details__group">
                <Form.Item
                  name="username"
                  label={<Text>Tên đăng nhập</Text>}
                  className="details__item"
                  rules={[
                    {
                      required: true,
                      message: getMessage(
                        CODE_ERROR.ERROR_REQUIRED,
                        MESSAGE_ERROR,
                        "Tên đăng nhập"
                      ),
                    },
                    {
                      pattern: /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){8,25}$/,
                      message: getMessage(
                        CODE_ERROR.ERROR_FORMAT,
                        MESSAGE_ERROR,
                        "Tên đăng nhập"
                      ),
                    },
                    {
                      max: 25,
                      message: getMessage(
                        CODE_ERROR.ERROR_NUMBER_MAX,
                        MESSAGE_ERROR,
                        "Tên đăng nhập",
                        25
                      ),
                    },
                    {
                      min: 8,
                      message: getMessage(
                        CODE_ERROR.ERROR_NUMBER_MIN,
                        MESSAGE_ERROR,
                        "Tên đăng nhập",
                        8
                      ),
                    },
                  ]}
                >
                  <Input placeholder="Tên đăng nhập" />
                </Form.Item>
                <Form.Item
                  name="email"
                  label={<Text>Email</Text>}
                  className="details__item"
                  rules={[
                    {
                      required: true,
                      message: getMessage(
                        CODE_ERROR.ERROR_REQUIRED,
                        MESSAGE_ERROR,
                        "Email"
                      ),
                    },
                    {
                      type: "email",
                      message: getMessage(
                        CODE_ERROR.ERROR_EMAIL,
                        MESSAGE_ERROR,
                        "Email"
                      ),
                    },
                  ]}
                >
                  <Input placeholder="username" />
                </Form.Item>
              </div>
              <div className="details__group">
                <Form.Item
                  name="password"
                  label={<Text>Mật khẩu</Text>}
                  className="details__item"
                  rules={[
                    {
                      required: true,
                      message: getMessage(
                        CODE_ERROR.ERROR_REQUIRED,
                        MESSAGE_ERROR,
                        "Mật khẩu"
                      ),
                    },
                    // {
                    //   pattern:
                    //     /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,25}$/,
                    //   message: getMessage(
                    //     CODE_ERROR.ERROR_FORMAT_PASSWORD,
                    //     MESSAGE_ERROR,
                    //     "Mật khẩu"
                    //   ),
                    // },
                    {
                      max: 25,
                      message: getMessage(
                        CODE_ERROR.ERROR_MAX_LENGTH,
                        MESSAGE_ERROR,
                        "Mật khẩu",
                        25
                      ),
                    },
                    {
                      min: 8,
                      message: getMessage(
                        CODE_ERROR.ERROR_MIN_LENGTH,
                        MESSAGE_ERROR,
                        "Mật khẩu",
                        8
                      ),
                    },
                  ]}
                >
                  <Input.Password
                    type="password"
                    placeholder="●●●●●●●●●"
                    className="login_input pass"
                  />
                </Form.Item>
                <Form.Item
                  name="rePassword"
                  label={<Text>Xác nhận mật khẩu</Text>}
                  className="details__item"
                  dependencies={["password"]}
                  rules={[
                    {
                      required: true,
                      message: getMessage(
                        CODE_ERROR.ERROR_REQUIRED,
                        MESSAGE_ERROR,
                        "Xác nhận mật khẩu"
                      ),
                    },
                    {
                      max: 25,
                      message: getMessage(
                        CODE_ERROR.ERROR_MAX_LENGTH,
                        MESSAGE_ERROR,
                        "Xác nhận mật khẩu",
                        25
                      ),
                    },
                    {
                      min: 8,
                      message: getMessage(
                        CODE_ERROR.ERROR_MIN_LENGTH,
                        MESSAGE_ERROR,
                        "Xác nhận mật khẩu",
                        8
                      ),
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("Mật khẩu xác nhận không trùng khớp")
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    type="password"
                    placeholder="●●●●●●●●●"
                    className="login_input pass"
                  />
                </Form.Item>
              </div>

              <div className="btns">
                <Button
                  key="back"
                  shape={"round"}
                  htmlType="reset"
                  onClick={() => {
                    setModal1Open(false);
                    form.resetFields();
                  }}
                >
                  Huỷ bỏ
                </Button>
                <Button
                  key="submit"
                  shape={"round"}
                  type="primary"
                  htmlType="submit"
                >
                  Gửi đi
                </Button>
              </div>
            </Form>
          </Spin>
        </Modal>
      </motion.div>

      <motion.div
        animate={{ opacity: [0, 1], y: [50, 0] }}
        exit={{ opacity: [1, 0] }}
        transition={{ duration: 1 }}
      >
        <Table
          rowKey={(record) => record.id}
          columns={columns}
          loading={isLoading}
          rowClassName={(record, index) =>
            index % 2 === 0
              ? "table-row table-row-even"
              : "table-row table-row-odd"
          }
          dataSource={[...listAccounts]}
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
      </motion.div>
    </div>
  );
}
