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
  const { listAccounts, totalElements, page, size } = useSelector(
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
        page: page,
      }),
    });
  };

  useEffect(() => {
    const query = queryString.parse(location.search);
    if (query.page) {
      query.page = query.page - 1;
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
      title: "T??n ????ng nh???p",
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
      title: "Vai tr??",
      dataIndex: "role",
      key: "role",
      align: "center",
      filters: [
        {
          text: "Qu???n l??",
          value: "ROLE_ADMIN",
        },
        {
          text: "Nh??n vi??n",
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
      title: "Tr???ng th??i",
      dataIndex: "status",
      key: "status",
      align: "center",
      filters: [
        {
          text: "Ho???t ?????ng",
          value: 1,
        },
        {
          text: "Kh??ng Ho???t ?????ng",
          value: 0,
        },
      ],
      onFilter: (value, record) => record.status === value,
      filterSearch: true,
      render: (s) => {
        let color = s == 1 ? "green" : "volcano";
        return s == 1 ? (
          <Tag color={color} key={s}>
            HO???T ?????NG
          </Tag>
        ) : (
          <Tag color={color} key={s}>
            KH??NG HO???T ?????NG
          </Tag>
        );
      },
      sorter: (a, b) => a.status - b.status,
      sortDirections: ["descend", "ascend"],
    },
  ];

  const onSubmitCreate = ({ rePassword, ...params }) => {
    setIsLoadingModal(true);
    dispatch(createAccEmployee({ data: { ...params, role: "ROLE_EMPLOYEE" } }))
      .then(unwrapResult)
      .then(({ data }) => {
        if (data === true) {
          const query = queryString.parse(location.search);
          if (query.page) {
            query.page = query.page - 1;
          }

          dispatch(getAccounts({ ...query, sort: "createAt,desc" }))
            .then(unwrapResult)
            .then(() => {
              notification.success({
                message: "T??i kho???n",
                description: "T???o t??i kho???n Nh??n vi??n m???i th??nh c??ng",
              });
              form.resetFields();
              setModal1Open(false);
              setIsLoadingModal(false);
            });
        } else {
          setIsLoadingModal(false);
          notification.success({
            message: "T??i kho???n",
            description: data.Error.message,
          });
        }
      })
      .catch((error) => {
        setIsLoadingModal(false);
        notification.error({
          message: "????ng nh???p",
          description: error?.Error?.message || "L???i r???i!!!",
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
        <Title level={2}>Danh s??ch T??i kho???n</Title>

        <Button
          type="primary"
          shape={"round"}
          onClick={() => setModal1Open(true)}
          style={{ width: "15rem", height: "3.8rem" }}
        >
          T???o T??i kho???n
        </Button>

        <Modal
          title="T???o T??i kho???n m???i"
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
                  label={<Text>T??n ????ng nh???p</Text>}
                  className="details__item"
                  rules={[
                    {
                      required: true,
                      message: getMessage(
                        CODE_ERROR.ERROR_REQUIRED,
                        MESSAGE_ERROR,
                        "T??n ????ng nh???p"
                      ),
                    },
                    {
                      pattern: /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){8,25}$/,
                      message: getMessage(
                        CODE_ERROR.ERROR_FORMAT,
                        MESSAGE_ERROR,
                        "T??n ????ng nh???p"
                      ),
                    },
                    {
                      max: 25,
                      message: getMessage(
                        CODE_ERROR.ERROR_NUMBER_MAX,
                        MESSAGE_ERROR,
                        "T??n ????ng nh???p",
                        25
                      ),
                    },
                    {
                      min: 8,
                      message: getMessage(
                        CODE_ERROR.ERROR_NUMBER_MIN,
                        MESSAGE_ERROR,
                        "T??n ????ng nh???p",
                        8
                      ),
                    },
                  ]}
                >
                  <Input placeholder="T??n ????ng nh???p" />
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
                  label={<Text>M???t kh???u</Text>}
                  className="details__item"
                  rules={[
                    {
                      required: true,
                      message: getMessage(
                        CODE_ERROR.ERROR_REQUIRED,
                        MESSAGE_ERROR,
                        "M???t kh???u"
                      ),
                    },
                    // {
                    //   pattern:
                    //     /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,25}$/,
                    //   message: getMessage(
                    //     CODE_ERROR.ERROR_FORMAT_PASSWORD,
                    //     MESSAGE_ERROR,
                    //     "M???t kh???u"
                    //   ),
                    // },
                    {
                      max: 25,
                      message: getMessage(
                        CODE_ERROR.ERROR_MAX_LENGTH,
                        MESSAGE_ERROR,
                        "M???t kh???u",
                        25
                      ),
                    },
                    {
                      min: 8,
                      message: getMessage(
                        CODE_ERROR.ERROR_MIN_LENGTH,
                        MESSAGE_ERROR,
                        "M???t kh???u",
                        8
                      ),
                    },
                  ]}
                >
                  <Input.Password
                    type="password"
                    placeholder="???????????????????????????"
                    className="login_input pass"
                  />
                </Form.Item>
                <Form.Item
                  name="rePassword"
                  label={<Text>X??c nh???n m???t kh???u</Text>}
                  className="details__item"
                  dependencies={["password"]}
                  rules={[
                    {
                      required: true,
                      message: getMessage(
                        CODE_ERROR.ERROR_REQUIRED,
                        MESSAGE_ERROR,
                        "X??c nh???n m???t kh???u"
                      ),
                    },
                    {
                      max: 25,
                      message: getMessage(
                        CODE_ERROR.ERROR_MAX_LENGTH,
                        MESSAGE_ERROR,
                        "X??c nh???n m???t kh???u",
                        25
                      ),
                    },
                    {
                      min: 8,
                      message: getMessage(
                        CODE_ERROR.ERROR_MIN_LENGTH,
                        MESSAGE_ERROR,
                        "X??c nh???n m???t kh???u",
                        8
                      ),
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        if (!value || getFieldValue("password") === value) {
                          return Promise.resolve();
                        }
                        return Promise.reject(
                          new Error("M???t kh???u x??c nh???n kh??ng tr??ng kh???p")
                        );
                      },
                    }),
                  ]}
                >
                  <Input.Password
                    type="password"
                    placeholder="???????????????????????????"
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
                  Hu??? b???
                </Button>
                <Button
                  key="submit"
                  shape={"round"}
                  type="primary"
                  htmlType="submit"
                >
                  G???i ??i
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
          scroll={{ x: "maxContent" }}
          rowClassName={(record, index) =>
            index % 2 === 0
              ? "table-row table-row-even"
              : "table-row table-row-odd"
          }
          dataSource={[...listAccounts]}
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
