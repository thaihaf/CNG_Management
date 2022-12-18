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
  notification,
} from "antd";
import {
  SupplierManagerPaths,
  getSuppliers,
  deleteSupplier,
  deleteSuppliers,
  bankNameList,
} from "features/supplier-manager/supplierManager";
import avt_default from "assets/images/avt-default.png";
import "./SupplierList.css";
import { CODE_ERROR } from "constants/errors.constants";
import { MESSAGE_ERROR } from "constants/messages.constants";
import { getMessage } from "helpers/util.helper";
import { storage } from "firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { createDetails } from "features/supplier-manager/supplierManager";
import {
  getDistrict,
  getProvince,
  getProvinces,
} from "features/provinces/provinces";

import editImg from "assets/icons/edit.png";
import deleteImg from "assets/icons/delete.png";
import { SupplierModal } from "features/supplier-manager/components";

const { Title, Text } = Typography;
const { Option } = Select;

export default function SupplierList() {
  const { listSuppliers, totalElements, number, size } = useSelector(
    (state) => state.supplier
  );
 
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const [isLoading, setIsLoading] = useState(false);
  const [imgURL, setImgUrl] = useState(null);

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const onHandlePagination = (pageCurrent, pageSize) => {
    setIsLoading(true);

    const page = pageCurrent.toString();
    const size = pageSize.toString();
    const params = queryString.parse(location.search);

    history.push({
      pathname: SupplierManagerPaths.SUPPLIER_LIST,
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
      content: "Bạn chắc chắn muốn xoá không?",
      okText: "Xoá",
      cancelText: "Huỷ bỏ",
      onOk: () => {
        setIsLoading(true);
        dispatch(deleteSupplier(record.id))
          .then(unwrapResult)
          .then((res) => {
            console.log(res);
            dispatch(getProvinces())
              .then(unwrapResult)
              .then(() => {
                notification.success({
                  message: "Xoá Nhà cung cấp",
                  description: "Xoá Nhà cung cấp thành công",
                });
                setIsLoading(false);
              });
          })
          .catch((error) => {
            console.log(error);
            notification.error({
              message: "Xoá Nhà cung cấp",
              description: "Xoá Nhà cung cấp thất bại",
            });
          });
      },
      onCancel: () => {},
    });
  };
  const onRowDetails = (record) => {
    history.push(
      SupplierManagerPaths.SUPPLIER_DETAIL.replace(
        ":supplierId",
        record.id || ""
      )
    );
  };

  useEffect(() => {
    setIsLoading(true);

    let query = queryString.parse(location.search);
    if (query.number) {
      query.number = query.number - 1;
    }
    dispatch(getSuppliers(query))
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
      title: "Ảnh đại diện",
      dataIndex: "avatarSupplier",
      key: "avatarSupplier",
      align: "center",
      render: (value) => (
        <Avatar size={50} src={value === "" ? avt_default : value} />
      ),
    },
    {
      title: "Tên nhà cung cấp",
      dataIndex: "supplierName",
      key: "supplierName",
      align: "center",
      ...getColumnSearchProps("supplierName"),
      sorter: (a, b) => a.supplierName - b.supplierName,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Người liên hệ",
      key: "fullName",
      align: "center",
      render: (record) =>
        `${record.firstContactName} ${record.lastContactName}`,
    },
    {
      title: "Tên Ngân hàng",
      dataIndex: "bankName",
      key: "bankName",
      align: "center",
      ...getColumnSearchProps("bankName"),
      sorter: (a, b) => a.bankName.length - b.bankName.length,
    },
    {
      title: "Tài khoản ngân hàng",
      dataIndex: "bankAccountNumber",
      key: "bankAccountNumber",
      align: "center",
      ...getColumnSearchProps("bankAccountNumber"),
      sorter: (a, b) => a.bankAccountNumber.length - b.bankAccountNumber.length,
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumberContact",
      key: "phoneNumberContact",
      align: "center",
      ...getColumnSearchProps("phoneNumberContact"),
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
            HOẠT ĐỘNG
          </Tag>
        ) : (
          <Tag color={color} key={s}>
            KHÔNG HOẠT ĐỘNG
          </Tag>
        );
      },
      align: "center",
      sorter: (a, b) => a.status - b.status,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Hành động",
      dataIndex: "operation",
      key: "operation",
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

  return (
    <div className="supplier-list">
      <div className="top">
        <Title level={2}>Danh sách Nhà cung cấp</Title>

        <SupplierModal />
      </div>
      <Table
        rowKey={(record) => record.id}
        columns={columns}
        loading={isLoading}
        dataSource={[...listSuppliers]}
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
