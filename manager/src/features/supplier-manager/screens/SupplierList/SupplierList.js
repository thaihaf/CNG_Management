import React, { useEffect, useRef, useState } from "react";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";

import queryString from "query-string";
import Highlighter from "react-highlight-words";

import { ExclamationCircleOutlined, SearchOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Form,
  Input,
  Modal,
  Space,
  Table,
  Tag,
  Typography,
  notification,
} from "antd";
import avt_default from "assets/images/avt-default.png";
import { motion } from "framer-motion/dist/framer-motion";

import { getProvinces } from "features/provinces/provinces";
import {
  SupplierManagerPaths,
  getSuppliers,
  deleteSupplier,
  updateListSuppliers,
} from "features/supplier-manager/supplierManager";
import { SupplierModal } from "features/supplier-manager/components";

import editImg from "assets/icons/edit.png";
import deleteImg from "assets/icons/delete.png";

import "./SupplierList.css";

const { Title, Text } = Typography;

export default function SupplierList() {
  const { listSuppliers, totalElements, page, size } = useSelector(
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
        page: page,
      }),
    });
  };

  const onRowDelete = (record) => {
    Modal.confirm({
      title: "X??c nh???n",
      icon: <ExclamationCircleOutlined />,
      content: "B???n ch???c ch???n mu???n xo?? kh??ng?",
      okText: "Xo??",
      cancelText: "Hu??? b???",
      onOk: () => {
        setIsLoading(true);
        dispatch(deleteSupplier(record.id))
          .then(unwrapResult)
          .then((res) => {
            const newList = listSuppliers.map((c) => {
              if (c.id === record.id) {
                return { ...record, status: 0 };
              } else {
                return c;
              }
            });

            dispatch(updateListSuppliers(newList));

            notification.success({
              message: "Xo?? Nh?? cung c???p",
              description: "Xo?? Nh?? cung c???p th??nh c??ng",
            });
            setIsLoading(false);
          })
          .catch((error) => {
            setIsLoading(false);
            notification.error({
              message: "Xo?? Nh?? cung c???p",
              description: "Xo?? Nh?? cung c???p th???t b???i",
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
    if (query.page) {
      query.page = query.page - 1;
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
      title: "???nh ?????i di???n",
      dataIndex: "avatarSupplier",
      key: "avatarSupplier",
      align: "center",
      render: (value) => (
        <Avatar size={50} src={value === "" ? avt_default : value} />
      ),
    },
    {
      title: "T??n nh?? cung c???p",
      dataIndex: "supplierName",
      key: "supplierName",
      align: "center",
      ...getColumnSearchProps("supplierName"),
      sorter: (a, b) => a.supplierName - b.supplierName,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Ng?????i li??n h???",
      key: "fullName",
      align: "center",
      render: (record) =>
        `${record.firstContactName} ${record.lastContactName}`,
    },
    {
      title: "T??n Ng??n h??ng",
      dataIndex: "bankName",
      key: "bankName",
      align: "center",
      ...getColumnSearchProps("bankName"),
      sorter: (a, b) => a.bankName.length - b.bankName.length,
    },
    {
      title: "T??i kho???n ng??n h??ng",
      dataIndex: "bankAccountNumber",
      key: "bankAccountNumber",
      align: "center",
      ...getColumnSearchProps("bankAccountNumber"),
      sorter: (a, b) => a.bankAccountNumber.length - b.bankAccountNumber.length,
    },
    {
      title: "S??? ??i???n tho???i",
      dataIndex: "phoneNumberContact",
      key: "phoneNumberContact",
      align: "center",
      ...getColumnSearchProps("phoneNumberContact"),
    },
    {
      title: "Tr???ng th??i",
      dataIndex: "status",
      key: "status",
      filters: [
        {
          text: "Ho???t ?????ng",
          value: 1,
        },
        {
          text: "Kh??ng ho???t ?????ng",
          value: 0,
        },
      ],
      onFilter: (value, record) => record.status === value,
      filterSearch: true,
      render: (s) => {
        let color = s === 1 ? "green" : "volcano";
        return s === 1 ? (
          <Tag color={color} key={s}>
            HO???T ?????NG
          </Tag>
        ) : (
          <Tag color={color} key={s}>
            KH??NG HO???T ?????NG
          </Tag>
        );
      },
      align: "center",
      sorter: (a, b) => a.status - b.status,
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "H??nh ?????ng",
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
            onClick={() => onRowDetails(record)}
          >
            <img
              src={editImg}
              alt="Edit"
              style={{ width: "2.2rem", height: "2.2rem", margin: "auto" }}
            />
          </div>

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
              onClick={() => onRowDelete(record)}
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

  return (
    <div className="supplier-list">
      <motion.div
        className="top"
        animate={{ opacity: [0, 1] }}
        exit={{ opacity: [1, 0] }}
        transition={{ duration: 1 }}
      >
        <Title level={2}>Danh s??ch Nh?? cung c???p</Title>

        <SupplierModal />
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
          scroll={{ x: "maxContent" }}
          dataSource={[...listSuppliers]}
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
