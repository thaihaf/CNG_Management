import React, { useEffect, useRef, useState } from "react";
import queryString from "query-string";
import Highlighter from "react-highlight-words";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { DownOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import {
  CameraOutlined,
  DeleteTwoTone,
  ExclamationCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Avatar,
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
  Upload,
  Select,
} from "antd";
import {
  CustomerManagerPaths,
  getCustomers,
  deleteCustomer,
  deleteCustomers,
} from "features/customer-manager/customerManager";
import avt_default from "assets/images/avt-default.png";
import "./CustomerList.css";
import { CODE_ERROR } from "constants/errors.constants";
import { MESSAGE_ERROR } from "constants/messages.constants";
import { getMessage } from "helpers/util.helper";
import { storage } from "firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { createDetails } from "features/customer-manager/customerManager";
import {
  getDistrict,
  getProvince,
  getProvinces,
} from "features/provinces/provinces";

const { Title, Text } = Typography;
const { Option } = Select;
export default function CustomerList() {
  const { listCustomers, totalElements, totalPages, size } = useSelector(
    (state) => state.customer
  );
  const { dataDetails, createMode } = useSelector((state) => state.customer);
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
  const [imgURL, setImgUrl] = useState(null);
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

  const defaultValues = {
    status: 0,
    gender: true,
  };
  const initialValues = createMode ? defaultValues : dataDetails;

  const upLoadImg = async (file) => {
    if (file == null) return;

    const imgRef = ref(storage, `images/${file.name + v4()}`);
    uploadBytes(imgRef, file).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setIsLoading(false);
        setImgUrl(url);
      });
    });
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
      content: "Delete can't revert, scarefully",
      okText: "Delete",
      cancelText: "Cancel",
      onOk: () => {
        setIsLoading(true);
        dispatch(
          record ? deleteCustomer(record.id) : deleteCustomers(selectedRowKeys)
        )
          .then(unwrapResult)
          .then((res) => {
            console.log(res);
            dispatch(getProvinces())
              .then(unwrapResult)
              .then(() => setIsLoading(false));
            message.success("Delete success!");
          })
          .catch((error) => {
            console.log(error);
            message.success("Delete failed!!!");
          });
      },
      onCancel: () => {},
    });
  };
  const onRowDetails = (record) => {
    history.push(
      CustomerManagerPaths.CUSTOMER_DETAIL.replace(
        ":customerId",
        record.id || ""
      )
    );
  };

  useEffect(() => {
    const query = queryString.parse(location.search);
    setIsLoading(true);
    dispatch(getCustomers())
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
      title: "Avatar",
      dataIndex: "avatar",
      key: "avatar",
      align: "center",
      width: "10%",
      render: (_, record) => (
        <Avatar size={50} src={record.fileAttachDTO.filePath} />
      ),
    },
    {
      title: "Shop Name",
      dataIndex: "shopName",
      key: "shopName",
      width: "20%",
      ...getColumnSearchProps("shopName"),
      sorter: (a, b) => a.shopName - b.shopName,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
      width: "20%",
      ...getColumnSearchProps("firstName"),
      sorter: (a, b) => a.firstName.length - b.firstName.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
      width: "20%",
      ...getColumnSearchProps("lastName"),
      sorter: (a, b) => a.lastName.length - b.lastName.length,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: "20%",
      ...getColumnSearchProps("phoneNumber"),
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
      title: "Actions",
      dataIndex: "operation",
      key: "operation",
      render: (_, record) => (
        <Dropdown
          overlay={
            <Menu
              items={[
                {
                  key: 1,
                  label: "View Details and Update",
                  onClick: () => onRowDetails(record),
                },
                {
                  key: 2,
                  label: "Delete Customer",
                  onClick: () => onRowDelete(record),
                },
              ]}
            />
          }
        >
          <a>
            More <DownOutlined />
          </a>
        </Dropdown>
      ),
    },
  ];
  const hasSelected = selectedRowKeys.length > 0;

  const onSubmitCreate = async ({
    apartmentNumber,
    city,
    district,
    ward,
    ...args
  }) => {
    console.log(apartmentNumber);
    dispatch(
      createDetails({
        data: {
          addressDTO: {
            city: city.value,
            district: district.value,
            ward: ward.value,
            apartmentNumber: apartmentNumber,
          },
          ...args,
          status: 1,
          fileAttachDTO: {
            filePath: imgURL === null ? "" : imgURL,
          },
        },
      })
    )
      .then(unwrapResult)
      .then((res) => {
        console.log(res);
        message.success("Create customer success!");
      })
      .catch((error) => {
        console.log(error);
        console.log(args);
        message.error("Create customer failed!");
        //  dispatch(updateError(CODE_ERROR.ERROR_LOGIN));
      });
  };

  useEffect(() => {
    dispatch(getProvinces());
    // setComponentDisabled(createMode);
  }, [dispatch]);

  useEffect(() => {
    form.setFieldsValue(initialValues);
    if (!createMode && initialValues !== null) {
      setImgUrl(initialValues.avatarSupplier);
    }
  }, [dispatch, createMode, initialValues]);

  return (
    <div className="employee-list">
      <div className="top">
        <Title level={2}>Customers List</Title>
        <div>
          <span
            style={{
              marginRight: 9,
            }}
          >
            {hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}
          </span>
          <Button
            className="btnDelete"
            onClick={() => onRowDelete()}
            disabled={!hasSelected}
            loading={isLoading}
            shape="round"
            icon={<DeleteTwoTone twoToneColor="#eb2f96" />}
          >
            Delete
          </Button>
          <Button
            type="primary"
            shape={"round"}
            size={"large"}
            onClick={() => setModal1Open(true)}
          >
            Create Customer
          </Button>
          <Modal
            title="Create New Customer"
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
              {<Text>Avatar</Text>}
              <div className="details__group">
                <div className="details__avatar">
                  <div className="details__avatar-img">
                    <img
                      src={!imgURL || imgURL === "" ? avt_default : imgURL}
                      alt="avt"
                    />
                  </div>
                  <Form.Item
                    valuePropName="fileList"
                    className="item_choose-avt"
                    name="avt"
                  >
                    <ImgCrop rotate>
                      <Upload
                        listType="picture-card"
                        maxCount={1}
                        beforeUpload={(file) => {
                          setIsLoading(true);
                          return new Promise((resolve) => {
                            const reader = new FileReader();
                            reader.onload = () => {
                              if (reader.readyState === 2) {
                                setImgUrl(reader.result);
                                upLoadImg(file);
                              }
                            };
                            reader.readAsDataURL(file);
                          });
                        }}
                      >
                        <CameraOutlined
                          style={{
                            fontSize: "2rem",
                          }}
                        />
                      </Upload>
                    </ImgCrop>
                  </Form.Item>
                </div>
              </div>

              <div className="details__group">
                <Form.Item
                  name="firstName"
                  label={<Text>First Name</Text>}
                  className="details__item"
                  rules={[
                    {
                      required: true,
                      message: getMessage(
                        CODE_ERROR.ERROR_REQUIRED,
                        MESSAGE_ERROR,
                        "First Name"
                      ),
                    },
                    {
                      max: 10,
                      message: getMessage(
                        CODE_ERROR.ERROR_NUMBER_MAX,
                        MESSAGE_ERROR,
                        "First Name",
                        10
                      ),
                    },
                    {
                      min: 2,
                      message: getMessage(
                        CODE_ERROR.ERROR_NUMBER_MIN,
                        MESSAGE_ERROR,
                        "First Name",
                        2
                      ),
                    },
                  ]}
                >
                  <Input placeholder="FirstName" />
                </Form.Item>

                <Form.Item
                  name="lastName"
                  label={<Text>Last Name</Text>}
                  className="details__item"
                  rules={[
                    {
                      required: true,
                      message: getMessage(
                        CODE_ERROR.ERROR_REQUIRED,
                        MESSAGE_ERROR,
                        "Last Name"
                      ),
                    },
                    {
                      max: 20,
                      message: getMessage(
                        CODE_ERROR.ERROR_NUMBER_MAX,
                        MESSAGE_ERROR,
                        "Last Name",
                        20
                      ),
                    },
                    {
                      min: 2,
                      message: getMessage(
                        CODE_ERROR.ERROR_NUMBER_MIN,
                        MESSAGE_ERROR,
                        "Last Name",
                        2
                      ),
                    },
                  ]}
                >
                  <Input placeholder="LastName" />
                </Form.Item>
              </div>
              <div className="details__group">
                <Form.Item
                  name="phoneNumber"
                  label={<Text>Phone Number</Text>}
                  className="details__item"
                  rules={[
                    {
                      required: true,
                      message: getMessage(
                        CODE_ERROR.ERROR_REQUIRED,
                        MESSAGE_ERROR,
                        "Phone Number"
                      ),
                    },
                    {
                      max: 10,
                      message: getMessage(
                        CODE_ERROR.ERROR_NUMBER_MAX,
                        MESSAGE_ERROR,
                        "Phone Number",
                        10
                      ),
                    },
                    {
                      min: 9,
                      message: getMessage(
                        CODE_ERROR.ERROR_NUMBER_MIN,
                        MESSAGE_ERROR,
                        "Phone Number",
                        9
                      ),
                    },
                  ]}
                >
                  <Input placeholder="PhoneNumber" />
                </Form.Item>

                <Form.Item
                  name="shopName"
                  label={<Text>Shop Name</Text>}
                  className="details__item"
                  rules={[
                    {
                      required: true,
                      message: getMessage(
                        CODE_ERROR.ERROR_REQUIRED,
                        MESSAGE_ERROR,
                        "Shop Name"
                      ),
                    },
                    {
                      max: 25,
                      message: getMessage(
                        CODE_ERROR.ERROR_NUMBER_MAX,
                        MESSAGE_ERROR,
                        "Shop Name",
                        25
                      ),
                    },
                    {
                      min: 2,
                      message: getMessage(
                        CODE_ERROR.ERROR_NUMBER_MIN,
                        MESSAGE_ERROR,
                        "Shop Name",
                        2
                      ),
                    },
                  ]}
                >
                  <Input placeholder="ShopName" />
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
                        "Tax Code"
                      ),
                    },
                    {
                      max: 13,
                      message: getMessage(
                        CODE_ERROR.ERROR_NUMBER_MAX,
                        MESSAGE_ERROR,
                        "Tax Code",
                        13
                      ),
                    },
                    {
                      min: 10,
                      message: getMessage(
                        CODE_ERROR.ERROR_NUMBER_MIN,
                        MESSAGE_ERROR,
                        "Tax Code",
                        10
                      ),
                    },
                  ]}
                >
                  <Input placeholder="TaxCode" />
                </Form.Item>
              </div>
              <div className="details__group">
                <Form.Item
                  name="apartmentNumber"
                  label={<Text>Street Name, House No</Text>}
                  className="details__item"
                  rules={[
                    {
                      required: true,
                      message: getMessage(
                        CODE_ERROR.ERROR_REQUIRED,
                        MESSAGE_ERROR,
                        "Street Name, House No"
                      ),
                    },
                  ]}
                >
                  <Input placeholder="Street Name, House No" />
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
      </div>
      <Table
        rowKey="id"
        columns={columns}
        loading={isLoading}
        dataSource={listCustomers}
        pagination={
          listCustomers.length !== 0
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
