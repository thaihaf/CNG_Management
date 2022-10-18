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
  BrandManagerPaths,
  getBrands,
} from "features/brand-manager/brandManager";

import "./BrandList.css";
import { CODE_ERROR } from "constants/errors.constants";
import { MESSAGE_ERROR } from "constants/messages.constants";
import { getMessage } from "helpers/util.helper";
import {
  updateErrorProcess,
  createBrand,
  createDetails,
} from "features/brand-manager/brandManager";
import {
  getDistrict,
  getProvince,
  getProvinces,
} from "features/provinces/provinces";
import { ClassSharp } from "@mui/icons-material";
const { Title, Text } = Typography;
const { Option } = Select;
export default function BrandList() {
  const { listBrands, totalElements, totalPages, size } = useSelector(
    (state) => state.brand
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
    dispatch(getBrands())
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
      title: "Brand Id",
      dataIndex: "id",
      key: "id",
      width: "20%",
      ...getColumnSearchProps("id"),
      sorter: (a, b) => a.id - b.id,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Brand Name",
      dataIndex: "brandName",
      key: "brandName",
      width: "20%",
      ...getColumnSearchProps("brandName"),
      sorter: (a, b) => a.brandName - b.brandName,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Supplier Id",
      dataIndex: "supplierId",
      key: "supplierId",
      width: "20%",
      ...getColumnSearchProps("supplierId"),
      sorter: (a, b) => a.supplierId - b.supplierId,
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
      width: "20%",
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
      BrandManagerPaths.BRAND_DETAIL.replace(
        ":brandId",
        record.id || ""
      )
    );
    console.log(record.id);
  };

  const onSubmitCreate = async ({...args }) => {
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
        message.success("Create brand success!");
      })
      .catch((error) => {
        console.log(error);
        console.log(args);
        message.error("Create brand failed!");
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
        <Title level={2}>Brand List</Title>
        <Button
          type="primary"
          shape={"round"}
          size={"large"}
          onClick={() => setModal1Open(true)}
        >
          Create Brand
        </Button>

        <Modal
          title="Create New Brand"
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
                name="brandName"
                label={<Text>Brand Name</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "brandName"
                    ),
                  },
                  {
                    max: 25,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MAX,
                      MESSAGE_ERROR,
                      "brandName",
                      25
                    ),
                  },
                  {
                    min: 2,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MIN,
                      MESSAGE_ERROR,
                      "brandName",
                      2
                    ),
                  },
                ]}
              >
                <Input placeholder="Brand Name" />
              </Form.Item>

              <Form.Item
                name="supplierId"
                label={<Text>Supplier Id</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "supplierId"
                    ),
                  },
                  {
                    max: 9,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MAX,
                      MESSAGE_ERROR,
                      "supplierId",
                      9
                    ),
                  },
                  {
                    min: 0,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MIN,
                      MESSAGE_ERROR,
                      "supplierId",
                      0
                    ),
                  },
                ]}
              >
                <Input placeholder="Supplier Id" />
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
        dataSource={listBrands}
        onRow={(record) => ({
          onClick: () => {
            onRowClick(record);
          },
        })}
        pagination={
          listBrands.length !== 0
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
