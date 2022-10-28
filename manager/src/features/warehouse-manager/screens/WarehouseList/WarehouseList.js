import React, { useEffect, useRef, useState } from "react";
import moment from "moment";
import queryString from "query-string";
import Highlighter from "react-highlight-words";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { DownOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
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
} from "antd";
import {
  WarehouseManagerPaths,
  getWarehouses,
  deleteWarehouse,
  deleteWarehouses,
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
const { Title, Text } = Typography;
const { Option } = Select;
export default function WarehouseList() {
  const { listWarehouses, totalElements, totalPages, size } = useSelector(
    (state) => state.warehouse
  );
  const { dataDetails, createMode } = useSelector((state) => state.warehouse);
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
  const searchInput = useRef(null);

  const defaultValues = {
    status: 0,
    gender: true,
  };
  const initialValues = createMode ? defaultValues : dataDetails;

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
          record
            ? deleteWarehouse(record.id)
            : deleteWarehouses(selectedRowKeys)
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
      WarehouseManagerPaths.WAREHOUSE_DETAIL.replace(
        ":warehouseId",
        record.id || ""
      )
    );
  };

  useEffect(() => {
    const query = queryString.parse(location.search);
    setIsLoading(true);
    dispatch(getWarehouses())
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
      title: "Id",
      dataIndex: "id",
      key: "id",
      width: "20%",
      ...getColumnSearchProps("id"),
      sorter: (a, b) => a.id - b.id,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Warehouse Name",
      dataIndex: "warehouseName",
      key: "warehouseName",
      width: "20%",
      ...getColumnSearchProps("warehouseName"),
      sorter: (a, b) => a.warehouseName - b.warehouseName,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Note Warehouse",
      dataIndex: "noteWarehouse",
      key: "noteWarehouse",
      width: "20%",
      ...getColumnSearchProps("noteWarehouse"),
      sorter: (a, b) => a.noteWarehouse - b.noteWarehouse,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Phone Number",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      width: "20%",
      ...getColumnSearchProps("phoneNumber"),
      sorter: (a, b) => a.phoneNumber.length - b.phoneNumber.length,
      sortDirections: ["descend", "ascend"],
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
                  label: "Delete Warehouse",
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
    dispatch(
      createDetails({
        data: {
          addressDTO: {
            city: typeof city === "string" ? city : city.value,
            district: typeof district === "string" ? district : district.value,
            ward: typeof ward === "string" ? ward : ward.value,
            apartmentNumber: apartmentNumber,
          },
          ...args,
          status: 1,
        },
      })
    )
      .then(unwrapResult)
      .then((res) => {
        console.log(res);
        message.success("Create warehouse success!");
      })
      .catch((error) => {
        console.log(error);
        console.log(args);
        message.error("Create warehouse failed!");
        //  dispatch(updateError(CODE_ERROR.ERROR_LOGIN));
      });
  };

  useEffect(() => {
    dispatch(getProvinces());
    // setComponentDisabled(createMode);
  }, [dispatch]);

  //   useEffect(() => {
  //     form.setFieldsValue(initialValues);
  //     if (!createMode && initialValues !== null) {
  //          setImgUrl(initialValues.avatarSupplier);
  //     }
  // }, [dispatch, createMode, initialValues]);

  return (
    <div className="employee-list">
      <div className="top">
        <Title level={2}>Warehouse List</Title>
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
            Create Warehouse
          </Button>
          <Modal
            title="Create New Warehouse"
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
                  name="warehouseName"
                  label={<Text>Warehouse Name</Text>}
                  className="details__item"
                  rules={[
                    {
                      required: true,
                      message: getMessage(
                        CODE_ERROR.ERROR_REQUIRED,
                        MESSAGE_ERROR,
                        "Warehouse Name"
                      ),
                    },
                    {
                      max: 25,
                      message: getMessage(
                        CODE_ERROR.ERROR_NUMBER_MAX,
                        MESSAGE_ERROR,
                        "Warehouse Name",
                        25
                      ),
                    },
                    {
                      min: 2,
                      message: getMessage(
                        CODE_ERROR.ERROR_NUMBER_MIN,
                        MESSAGE_ERROR,
                        "Warehouse Name",
                        2
                      ),
                    },
                  ]}
                >
                  <Input placeholder="WarehouseName" />
                </Form.Item>

                <Form.Item
                  name="noteWarehouse"
                  label={<Text>Note Warehouse</Text>}
                  className="details__item"
                  rules={[
                    {
                      required: true,
                      message: getMessage(
                        CODE_ERROR.ERROR_REQUIRED,
                        MESSAGE_ERROR,
                        "Note Warehouse"
                      ),
                    },
                    {
                      max: 25,
                      message: getMessage(
                        CODE_ERROR.ERROR_NUMBER_MAX,
                        MESSAGE_ERROR,
                        "Note Warehouse",
                        25
                      ),
                    },
                    {
                      min: 2,
                      message: getMessage(
                        CODE_ERROR.ERROR_NUMBER_MIN,
                        MESSAGE_ERROR,
                        "Note Warehouse",
                        2
                      ),
                    },
                  ]}
                >
                  <Input placeholder="NoteWarehouse" />
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
                  <Input placeholder="Street" />
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
        dataSource={listWarehouses}
        pagination={
          listWarehouses.length !== 0
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
        rowSelection={rowSelection}
      />
    </div>
  );
}
