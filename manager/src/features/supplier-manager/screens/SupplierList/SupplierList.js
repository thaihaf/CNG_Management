import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import queryString from "query-string";
import Highlighter from "react-highlight-words";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { DownOutlined } from "@ant-design/icons";
import {
  CameraOutlined,
  DownloadOutlined,
  LockOutlined,
  SearchOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Divider,
  Form,
  Input,
  message,
  Modal,
  Switch,
  Space,
  Table,
  Tag,
  Typography,
  Dropdown,
  Menu,
  Upload,
  Select,
} from "antd";
import {
  SupplierManagerPaths,
  getSuppliers,
} from "features/supplier-manager/supplierManager";

import "./SupplierList.css";
import { CODE_ERROR } from "constants/errors.constants";
import { MESSAGE_ERROR } from "constants/messages.constants";
import { getMessage } from "helpers/util.helper";
import {
  updateErrorProcess,
  createSupplier,
  createDetails,
} from "features/supplier-manager/supplierManager";
import {
  getDistrict,
  getProvince,
  getProvinces,
} from "features/provinces/provinces";
import { ClassSharp } from "@mui/icons-material";
const { Title, Text } = Typography;
const { Option } = Select;
export default function SupplierList() {
  const { listSuppliers, totalElements, totalPages, size } = useSelector(
    (state) => state.supplier
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
  const searchInput = useRef(null);

  useEffect(() => {
    const query = queryString.parse(location.search);
    setIsLoading(true);
    dispatch(getSuppliers())
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

  const menu = (
    <Menu
      selectable
      //   defaultSelectedKeys={['3']}
      items={[
        {
          key: "1",
          label: "View",
        },
        {
          key: "2",
          label: "Edit",
        },
        {
          key: "3",
          label: "Delete",
        },
      ]}
    />
  );

  const columns = [
    {
      title: "Avatar",
      dataIndex: "avatarSupplier",
      key: "avatarSupplier",
      width: "10%",
      render: (text, record) => {
        return (
          <div>
            <Avatar size={60} src={record.avatarSupplier} />
          </div>
        );
      },
    },
    {
      title: "Supplier Name",
      dataIndex: "supplierName",
      key: "supplierName",
      width: "10%",
      ...getColumnSearchProps("supplierName"),
      sorter: (a, b) => a.supplierName - b.supplierName,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "First Contact Name",
      dataIndex: "firstContactName",
      key: "firstContactName",
      width: "10%",
      ...getColumnSearchProps("firstContactName"),
      sorter: (a, b) => a.firstContactName.length - b.firstContactName.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Last Contact Name",
      dataIndex: "lastContactName",
      key: "lastContactName",
      width: "10%",
      ...getColumnSearchProps("lastContactName"),
      sorter: (a, b) => a.lastContactName.length - b.lastContactName.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Bank Name",
      dataIndex: "bankName",
      key: "bankName",
      width: "10%",
      ...getColumnSearchProps("bankName"),
      sorter: (a, b) => a.bankName.length - b.bankName.length,
    },
    {
      title: "Bank Account Number",
      dataIndex: "bankAccountNumber",
      key: "bankAccountNumber",
      width: "10%",
      ...getColumnSearchProps("bankAccountNumber"),
      sorter: (a, b) => a.bankAccountNumber.length - b.bankAccountNumber.length,
    },
    {
      title: "Phone Number Contact",
      dataIndex: "phoneNumberContact",
      key: "phoneNumberContact",
      width: "10%",
      ...getColumnSearchProps("phoneNumberContact"),
    },
    {
      title: "Status",
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
      width: "10%",
      sorter: (a, b) => a.status - b.status,
      sortDirections: ["descend", "ascend"],
    },
    {
      render: () => (
        <Space size="middle">
          <Dropdown overlay={menu}>
            <a>
              Action <DownOutlined />
            </a>
          </Dropdown>
        </Space>
      ),
    },
  ];

  const onRowClick = (record) => {
    history.push(
      SupplierManagerPaths.SUPPLIER_DETAIL.replace(
        ":supplierId",
        record.id || ""
      )
    );
    console.log(record.id);
  };

  const onSubmitCreate = async ({ city, district, ward, ...args }) => {
    dispatch(
      createDetails({
        data: {
          city: city.value,
          district: district.value,
          ward: ward.value,
          ...args,
          status: 1,
        },
      })
    )
      .then(unwrapResult)
      .then((res) => {
        console.log(res);
        message.success("Create supplier success!");
      })
      .catch((error) => {
        console.log(error);
        console.log(args);
        message.error("Create supplier failed!");
        //  dispatch(updateError(CODE_ERROR.ERROR_LOGIN));
      });
  };

  useEffect(() => {
    dispatch(getProvinces());
    // setComponentDisabled(createMode);
}, [dispatch]);

  return (
    <div className="employee-list">
      <div className="top">
        <Title level={2}>Supplier List</Title>
        <Button
          type="primary"
          shape={"round"}
          size={"large"}
          onClick={() => setModal1Open(true)}
        >
          Create Supplier
        </Button>

        <Modal
          title="Create New Supplier"
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
              <Avatar size={64} icon={<UserOutlined />} />
              <Form.Item
                name="avatarSupplier"
                label={<Text>Avatar Supplier</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "avatarSupplier"
                    ),
                  },
                ]}
              >
                <Input placeholder="Image Address" />
              </Form.Item>
            </div>
            <div className="details__group">
              <Form.Item
                name="firstContactName"
                label={<Text>First Contact Name</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "firstContactName"
                    ),
                  },
                  {
                    max: 20,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MAX,
                      MESSAGE_ERROR,
                      "firstContactName",
                      20
                    ),
                  },
                  {
                    min: 2,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MIN,
                      MESSAGE_ERROR,
                      "firstContactName",
                      2
                    ),
                  },
                ]}
              >
                <Input placeholder="FirstContactName" />
              </Form.Item>

              <Form.Item
                name="lastContactName"
                label={<Text>Last Contact Name</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "lastContactName"
                    ),
                  },
                  {
                    max: 20,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MAX,
                      MESSAGE_ERROR,
                      "lastContactName",
                      20
                    ),
                  },
                  {
                    min: 2,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MIN,
                      MESSAGE_ERROR,
                      "lastContactName",
                      2
                    ),
                  },
                ]}
              >
                <Input placeholder="LastContactName" />
              </Form.Item>
            </div>
            <div className="details__group">
              <Form.Item
                name="bankName"
                label={<Text>Bank Name</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "bankName"
                    ),
                  },
                  {
                    max: 25,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MAX,
                      MESSAGE_ERROR,
                      "bankName",
                      25
                    ),
                  },
                  {
                    min: 2,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MIN,
                      MESSAGE_ERROR,
                      "bankName",
                      8
                    ),
                  },
                ]}
              >
                <Input placeholder="BankName" />
              </Form.Item>

              <Form.Item
                name="bankAccountNumber"
                label={<Text>Bank Account Number</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "bankAccountNumber"
                    ),
                  },
                  {
                    max: 9,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MAX,
                      MESSAGE_ERROR,
                      "bankAccountNumber",
                      9
                    ),
                  },
                  {
                    min: 0,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MIN,
                      MESSAGE_ERROR,
                      "bankAccountNumber",
                      0
                    ),
                  },
                ]}
              >
                <Input placeholder="BankAccountNumber" />
              </Form.Item>
            </div>
            <div className="details__group">
              <Form.Item
                name="phoneNumberContact"
                label={<Text>Phone Number Contact</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "phoneNumberContact"
                    ),
                  },
                  {
                    max: 10,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MAX,
                      MESSAGE_ERROR,
                      "phoneNumberContact",
                      10
                    ),
                  },
                  {
                    min: 9,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MIN,
                      MESSAGE_ERROR,
                      "phoneNumberContact",
                      9
                    ),
                  },
                ]}
              >
                <Input placeholder="PhoneNumberContact" />
              </Form.Item>

              <Form.Item
                name="supplierName"
                label={<Text>Supplier Name</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "supplierName"
                    ),
                  },
                  {
                    max: 25,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MAX,
                      MESSAGE_ERROR,
                      "supplierName",
                      25
                    ),
                  },
                  {
                    min: 3,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MIN,
                      MESSAGE_ERROR,
                      "supplierName",
                      8
                    ),
                  },
                ]}
              >
                <Input placeholder="SupplierName" />
              </Form.Item>
            </div>
            <div className="details__group">
              <Form.Item
                name="taxCode"
                label={<Text>Tax Code</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "taxCode"
                    ),
                  },
                  {
                    max: 13,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MAX,
                      MESSAGE_ERROR,
                      "taxCode",
                      13
                    ),
                  },
                  {
                    min: 10,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MIN,
                      MESSAGE_ERROR,
                      "taxCode",
                      10
                    ),
                  },
                ]}
              >
                <Input placeholder="TaxCode" />
              </Form.Item>
              {/* <Form.Item
                name="description"
                label={<Text>Description</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "description"
                    ),
                  },
                  {
                    max: 13,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MAX,
                      MESSAGE_ERROR,
                      "description",
                      13
                    ),
                  },
                  {
                    min: 10,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MIN,
                      MESSAGE_ERROR,
                      "description",
                      10
                    ),
                  },
                ]}
              >
                <Input placeholder="Description" />
              </Form.Item> */}
            </div>
            <div className="details__group">
            <Form.Item
                name="apartmentNumber"
                label={<Text>Apartment Number</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "City"
                    ),
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="city"
                label={<Text>City</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "City"
                    ),
                  },
                ]}
              >
                <Select
                  labelInValue
                  showSearch
                  style={{
                    width: 200,
                  }}
                  onChange={(value) => {
                    dispatch(getProvince(value.key));
                  }}
                  placeholder="Search to Select"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.includes(input)
                  }
                  filterSort={(optionA, optionB) =>
                    optionA.children
                      .toLowerCase()
                      .localeCompare(optionB.children.toLowerCase())
                  }
                >
                  {provinces?.map((p) => {
                    return (
                      <Option value={p.name} key={p.code}>
                        {`${p.name}`}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </div>
            <div className="details__group">
              <Form.Item
                name="district"
                label={<Text>District</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "District"
                    ),
                  },
                ]}
              >
                <Select
                  labelInValue
                  showSearch
                  style={{
                    width: 200,
                  }}
                  onChange={(value, e) => {
                    dispatch(getDistrict(value.key));
                  }}
                  placeholder="Search to Select"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.includes(input)
                  }
                  filterSort={(optionA, optionB) =>
                    optionA.children
                      .toLowerCase()
                      .localeCompare(optionB.children.toLowerCase())
                  }
                >
                  {districts?.map((d) => {
                    return (
                      <Option value={d.name} key={d.code}>
                        {`${d.name}`}
                      </Option>
                    );
                  })}
                </Select>
              </Form.Item>

              <Form.Item
                name="ward"
                label={<Text>Ward</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "Ward"
                    ),
                  },
                ]}
              >
                <Select
                  labelInValue
                  showSearch
                  style={{
                    width: 200,
                  }}
                  onChange={(value, e) => {
                    console.log(value.value);
                    // dispatch(
                    // 		 getDistrict(value.key)
                    // );
                  }}
                  placeholder="Search to Select"
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.includes(input)
                  }
                  filterSort={(optionA, optionB) =>
                    optionA.children
                      .toLowerCase()
                      .localeCompare(optionB.children.toLowerCase())
                  }
                >
                  {wards?.map((w) => {
                    return (
                      <Option value={w.name} key={w.code}>
                        {`${w.name}`}
                      </Option>
                    );
                  })}
                </Select>
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
                Cancel
              </Button>
              <Button
                key="submit"
                shape={"round"}
                type="primary"
                htmlType="submit"
              >
                Submit
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={listSuppliers}
        onRow={(record) => ({
          onClick: () => {
            onRowClick(record);
          },
        })}
        pagination={
          listSuppliers.length !== 0
            ? {
                showSizeChanger: true,
                position: ["bottomCenter"],
                size: "default",
                pageSize: 10,
                // current: getPageUrl || pageHead,
                totalElements,
                // onChange: (page, size) =>
                // 	onHandlePagination(page, size),
                pageSizeOptions: ["10", "15", "20", "25"],
              }
            : false
        }
        loading={isLoading}
      />
    </div>
  );
}
