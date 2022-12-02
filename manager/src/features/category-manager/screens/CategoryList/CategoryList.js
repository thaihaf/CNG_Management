import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import queryString from "query-string";
import Highlighter from "react-highlight-words";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { DownOutlined } from "@ant-design/icons";
import {
  DeleteTwoTone,
  SearchOutlined,
  ExclamationCircleOutlined,
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
  CategoryManagerPaths,
  getCategories,
  deleteCategory,
  deleteCategories,
} from "features/category-manager/categoryManager";

import "./CategoryList.css";
import { CODE_ERROR } from "constants/errors.constants";
import { MESSAGE_ERROR } from "constants/messages.constants";
import { getMessage } from "helpers/util.helper";
import { createDetails } from "features/category-manager/categoryManager";
import {
  getDistrict,
  getProvince,
  getProvinces,
} from "features/provinces/provinces";
const { Title, Text } = Typography;
const { Option } = Select;
export default function CategoryList() {
  const { listCategories, totalElements, totalPages, size } = useSelector(
    (state) => state.category
  );
  const { provinces, districts, wards } = useSelector(
    (state) => state.provinces
  );
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const [componentDisabled, setComponentDisabled] = useState(true);
  const [modal1Open, setModal1Open] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [status, setStatus] = useState(null);
  const [searchedColumn, setSearchedColumn] = useState("");
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
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
          record ? deleteCategory(record.id) : deleteCategories(selectedRowKeys)
        )
          .then(unwrapResult)
          .then((res) => {
            console.log(res);
            dispatch(getCategories())
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
      CategoryManagerPaths.CATEGORY_DETAIL.replace(
        ":categoryId",
        record.id || ""
      )
    );
  };

  useEffect(() => {
    const query = queryString.parse(location.search);
    setIsLoading(true);
    dispatch(getCategories())
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
      title: "Vị trí",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (a, b, index) => <Text>{index + 1}</Text>,
    },
    {
      title: "Tên Chức năng",
      dataIndex: "categoryName",
      key: "categoryName",
      width: "20%",
      ...getColumnSearchProps("categoryName"),
      sorter: (a, b) => a.categoryName - b.categoryName,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Miêu tả",
      dataIndex: "description",
      key: "description",
      width: "20%",
      ...getColumnSearchProps("description"),
      sorter: (a, b) => a.description - b.description,
      sortDirections: ["descend", "ascend"],
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
            Hoạt động
          </Tag>
        ) : (
          <Tag color={color} key={s}>
            Không hoạt động
          </Tag>
        );
      },
      width: "20%",
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
                  label: "Xem chi tiết và Cập nhật",
                  onClick: () => onRowDetails(record),
                },
                {
                  key: 2,
                  label: "Xoá Chức năng",
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

  const onSubmitCreate = async ({ ...args }) => {
    dispatch(
      createDetails({
        data: {
          ...args,
          status: 1,
        },
      })
    )
      .then(unwrapResult)
      .then((res) => {
        console.log(res);
        notification.success({
          message: "Tạo Chức năng",
          description: "Tạo chức năng thành công",
        });
      })
      .catch((error) => {
        console.log(error);
        console.log(args);
        notification.error({
          message: "Tạo Chức năng",
          description: "Tạo chức năng thất bại",
        });
      });
  };

  useEffect(() => {
    dispatch(getProvinces());
  }, [dispatch]);

  return (
    <div className="employee-list">
      <div className="top">
        <Title level={2}>Danh sách Chức năng</Title>
        <div>
          <span
            style={{
              marginRight: 9,
            }}
          >
            {hasSelected ? `Đã chọn ${selectedRowKeys.length} mục` : ""}
          </span>
          <Button
            className="btnDelete"
            onClick={() => onRowDelete()}
            disabled={!hasSelected}
            loading={isLoading}
            shape="round"
            icon={<DeleteTwoTone twoToneColor="#eb2f96" />}
          >
            Xoá
          </Button>
          <Button
            type="primary"
            shape={"round"}
            size={"large"}
            onClick={() => setModal1Open(true)}
          >
            Tạo Chức năng
          </Button>
          <Modal
            title="Tạo Chức năg"
            style={{ top: 20 }}
            open={modal1Open}
            onOk={() => setModal1Open(false)}
            onCancel={() => setModal1Open(false)}
            footer={[]}
          >
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
                  name="categoryName"
                  label={<Text>Tên Chức năng</Text>}
                  className="details__item"
                  rules={[
                    {
                      required: true,
                      message: getMessage(
                        CODE_ERROR.ERROR_REQUIRED,
                        MESSAGE_ERROR,
                        "Tên Chức năng"
                      ),
                    },
                    {
                      pattern:
                        /^[a-zA-Z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]{2,25}$/,
                      message: getMessage(
                        CODE_ERROR.ERROR_NUMBER_LETTER,
                        MESSAGE_ERROR,
                        "Tên Chức năng"
                      ),
                    },
                    {
                      max: 25,
                      message: getMessage(
                        CODE_ERROR.ERROR_NUMBER_MAX,
                        MESSAGE_ERROR,
                        "Tên Chức năng",
                        25
                      ),
                    },
                    {
                      min: 2,
                      message: getMessage(
                        CODE_ERROR.ERROR_NUMBER_MIN,
                        MESSAGE_ERROR,
                        "Tên Chức năng",
                        2
                      ),
                    },
                  ]}
                >
                  <Input placeholder="Tên Chức năng" />
                </Form.Item>

                <Form.Item
                  name="description"
                  label={<Text>Mô tả</Text>}
                  className="details__item"
                  rules={[
                    {
                      required: true,
                      message: getMessage(
                        CODE_ERROR.ERROR_REQUIRED,
                        MESSAGE_ERROR,
                        "Mô tả"
                      ),
                    },
                  ]}
                >
                  <Input placeholder="Mô tả" />
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
                  Gửi
                </Button>
              </div>
            </Form>
          </Modal>
        </div>
      </div>
      <Table
        rowKey="id"
        columns={columns}
        loading={isLoading}
        dataSource={listCategories}
        pagination={
          listCategories.length !== 0
            ? {
                showSizeChanger: true,
                position: ["bottomCenter"],
                size: "mặc định",
                pageSize: pageSize,
                current: currentPage,
                totalElements,
                onChange: (page, size) => onHandlePagination(page, size),
                pageSizeOptions: ["2", "6", "10"],
              }
            : false
        }
        rowSelection={rowSelection}
      />
    </div>
  );
}
