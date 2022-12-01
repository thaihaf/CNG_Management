import React, { useEffect, useRef, useState } from "react";
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
  BrandManagerPaths,
  getBrands,
  deleteBrand,
  deleteBrands,
} from "features/brand-manager/brandManager";

import "./BrandList.css";
import { CODE_ERROR } from "constants/errors.constants";
import { MESSAGE_ERROR } from "constants/messages.constants";
import { getMessage } from "helpers/util.helper";
import { createDetails } from "features/brand-manager/brandManager";
import {
  getDistrict,
  getProvince,
  getProvinces,
} from "features/provinces/provinces";
import { getActiveSuppliers } from "features/supplier-manager/supplierManager";
import { getSuppliers } from "features/supplier-manager/supplierManager";
const { Title, Text } = Typography;
const { Option } = Select;
export default function BrandList() {
  const { listBrands, totalElements, totalPages, size } = useSelector(
    (state) => state.brand
  );
  const { listSuppliers } = useSelector((state) => state.supplier);
  const { listActiveSuppliers } = useSelector((state) => state.supplier);
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
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      content: "Bạn có chắc chắn muốn xoá Nhãn hàng không?",
      okText: "Xoá",
      cancelText: "Trở lại",
      onOk: () => {
        setIsLoading(true);
        dispatch(
          record ? deleteBrand(record.id) : deleteBrands(selectedRowKeys)
        )
          .then(unwrapResult)
          .then((res) => {
            console.log(res);
            dispatch(getBrands())
              .then(unwrapResult)
              .then(() => setIsLoading(false));
            message.success("Delete success!");
            notification.success({
              message: "Xoá Nhãn hàng",
              description: "Xoá nhãn hàng thành công!",
            });
          })
          .catch((error) => {
            console.log(error);
            notification.error({
              message: "Xoá Nhãn hàng",
              description: "Xoá nhãn hàng không thành công!",
            });
          });
      },
      onCancel: () => {},
    });
  };
  const onRowDetails = (record) => {
    history.push(
      BrandManagerPaths.BRAND_DETAIL.replace(":brandId", record.id || "")
    );
  };

  useEffect(() => {
    setIsLoading(true);
    dispatch(getActiveSuppliers());
    dispatch(getBrands())
      .then(unwrapResult)
      .then(() => setIsLoading(false));

    if (listSuppliers.length === 0 || !listSuppliers) {
      dispatch(getSuppliers())
        .then(unwrapResult)
        .then(() => setIsLoading(false));
    }
  }, [dispatch]);

  const onChange = (value) => {
    console.log(`selected ${value}`);
  };
  const onSearch = (value) => {
    console.log("search:", value);
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
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: "20%",
      ...getColumnSearchProps("id"),
      sorter: (a, b) => a.id - b.id,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Tên Nhãn hàng",
      dataIndex: "brandName",
      key: "brandName",
      width: "20%",
      ...getColumnSearchProps("brandName"),
      sorter: (a, b) => a.brandName - b.brandName,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Tên Nhà cung cấp",
      dataIndex: "supplierName",
      key: "supplierName",

      width: "20%",
      ...getColumnSearchProps("supplierName"),
      sorter: (a, b) => a.supplierName - b.supplierName,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      filters: [
        {
          text: "Active",
          value: 1,
        },
        {
          text: "In Active",
          value: 0,
        },
      ],
      onFilter: (value, record) => record.status === value,
      filterSearch: true,
      render: (s) => {
        let color = s === 1 ? "green" : "volcano";
        return s === 1 ? (
          <Tag color={color} key={s}>
            Active
          </Tag>
        ) : (
          <Tag color={color} key={s}>
            In Active
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
                  label: "Xem chi tiết và Chỉnh sửa",
                  onClick: () => onRowDetails(record),
                },
                {
                  key: 2,
                  label: "Xoá nhãn hàng",
                  onClick: () => onRowDelete(record),
                },
              ]}
            />
          }
        >
          <a>
            Nhiều hơn <DownOutlined />
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
         message: "Nhãn hàng",
         description: "Tạo mới Nhãn hàng thành công",
       });
      })
      .catch((error) => {
        console.log(error);
        console.log(args);
         notification.error({
           message: "Nhãn hàng",
           description: "Tạo mới Nhãn hàng thất bại",
         });
      });
  };

  useEffect(() => {
    dispatch(getProvinces());
  }, [dispatch]);

  return (
    <div className="employee-list">
      <div className="top">
        <Title level={2}>Danh sách Nhãn Hàng</Title>
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
            Xoá Nhãn Hàng
          </Button>
          <Button
            type="primary"
            shape={"round"}
            size={"large"}
            onClick={() => setModal1Open(true)}
          >
            Tạo Nhãn Hàng
          </Button>
          <Modal
            title="Tạo Mới Nhãn Hàng"
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
                  name="supplierId"
                  label={<Text>Tên Nhà cung cấp</Text>}
                  className="details__item"
                  rules={[
                    {
                      required: true,
                      message: getMessage(
                        CODE_ERROR.ERROR_REQUIRED_SELECT,
                        MESSAGE_ERROR,
                        "Tên Nhà cung cấp"
                      ),
                    },
                  ]}
                >
                  <Select
                    showSearch
                    placeholder="Chọn Nhà cung cấp"
                    optionFilterProp="children"
                    onChange={onChange}
                    onSearch={onSearch}
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  >
                    {listActiveSuppliers.map((s) => (
                      <Option value={s.id} key={s.id}>
                        {s.supplierName}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
                <Form.Item
                  name="brandName"
                  label={<Text>Tên Nhãn Hàng</Text>}
                  className="details__item"
                  rules={[
                    {
                      required: true,
                      message: getMessage(
                        CODE_ERROR.ERROR_REQUIRED,
                        MESSAGE_ERROR,
                        "Tên Nhãn Hàng"
                      ),
                    },
                    {
                      pattern:
                        /^[a-zA-Z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]{2,25}$/,
                      message: getMessage(
                        CODE_ERROR.ERROR_NUMBER_LETTER,
                        MESSAGE_ERROR,
                        "Tên Nhãn Hàng"
                      ),
                    },
                    {
                      max: 25,
                      message: getMessage(
                        CODE_ERROR.ERROR_NUMBER_MAX,
                        MESSAGE_ERROR,
                        "Tên Nhãn Hàng",
                        25
                      ),
                    },
                    {
                      min: 2,
                      message: getMessage(
                        CODE_ERROR.ERROR_NUMBER_MIN,
                        MESSAGE_ERROR,
                        "Tên Nhãn Hàng",
                        2
                      ),
                    },
                  ]}
                >
                  <Input placeholder="Tên Nhãn Hàng" />
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
                  Trở lại
                </Button>
                <Button
                  key="submit"
                  shape={"round"}
                  type="primary"
                  htmlType="submit"
                >
                  Tạo
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
        dataSource={listBrands}
        pagination={
          listBrands.length !== 0
            ? {
                showSizeChanger: true,
                position: ["bottomCenter"],
                size: "default",
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
