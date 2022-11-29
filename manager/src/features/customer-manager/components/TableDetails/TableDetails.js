import {
  CaretDownFilled,
  CaretUpFilled,
  DownOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import {
  Button,
  Dropdown,
  Form,
  Input,
  Menu,
  message,
  Modal,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { get } from "lodash";
import Highlighter from "react-highlight-words";

import deleteImg from "assets/icons/delete.png";
import editImg from "assets/icons/edit.png";

import "./TableDetails.css";
import DetailsModal from "../DetailsModal/DetailsModal";
import {
  deleteDetailsProduct,
  updateProductDetails,
} from "features/product-manager/productManager";
import { unwrapResult } from "@reduxjs/toolkit";
import { deleteDeptCustomer, updateDebtCustomers } from "features/customer-manager/customerManager";

const { Option } = Select;
const { Text, Title } = Typography;

export default function TableDetails({ form }) {
  const { listDebtCustomer } = useSelector(
    (state) => state.customer
  );

  const history = useHistory();
  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(4);

  const [searchText, setSearchText] = useState("");
  const [searchedColumn, setSearchedColumn] = useState("");
  const searchInput = useRef(null);

  const onHandlePagination = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };
  const handleDelete = (record) => {
    Modal.confirm({
      title: "Delete Debt Suppplier",
      icon: <ExclamationCircleOutlined />,
      content: `Delete Debt Suppplier can't revert, scarefully`,
      okText: "Delete",
      cancelText: "Cancel",
      onOk: () => {
        setIsLoading(true);
        dispatch(deleteDeptCustomer(record?.id))
          .then(unwrapResult)
          .then((res) => {
            let ab = listDebtCustomer.filter((item) => item.id !== record?.id);
            dispatch(updateDebtCustomers(ab));
            setIsLoading(false);
            message.success(`Delete Product Details success!`);
          })
          .catch((error) => {
            setIsLoading(false);
            message.error(error.message);
          });
      },
      onCancel: () => {},
    });
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
  const getColumnSearchProps = (dataIndex, nestedValue) => ({
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
    onFilter: (value, record) => {
      if (typeof record[dataIndex] !== "object") {
        return record[dataIndex]
          .toString()
          .toLowerCase()
          .includes(value.toLowerCase());
      } else {
        if (typeof nestedValue === "string") {
          return get(record, dataIndex)
            [nestedValue].toString()
            .toLowerCase()
            .includes(value.toLowerCase());
        } else {
          let parent = get(record, dataIndex);
          let data = nestedValue.reduce(
            (previousValue, currentValue) =>
              previousValue + " " + parent[currentValue],
            ""
          );
          return data.toString().toLowerCase().includes(value.toLowerCase());
        }
      }
    },

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

  const productColumns = [
    {
      title: "Index",
      dataIndex: "index",
      key: "index",
      align: "center",
      render: (a, b, index) => <Text>{index + 1}</Text>,
    },
    {
      title: "Debt Day",
      dataIndex: "debtDay",
      key: "debtDay",
      align: "center",
    },
    {
      title: "Payment Amount",
      dataIndex: "paymentAmount",
      key: "paymentAmount",
      align: "center",
      sorter: (a, b) =>
        parseFloat(a.paymentAmount) < parseFloat(b.paymentAmount),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Payment Type",
      dataIndex: "paymentType",
      key: "paymentType",
      align: "center",
    },
    {
      title: "Note",
      dataIndex: "note",
      key: "note",
      align: "center",
    },
    {
      title: "Actions",
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
          <DetailsModal record={record} updateMode={true} />
          <img
            src={deleteImg}
            alt=""
            style={{ width: "3rem", height: "3rem", cursor: "pointer" }}
            onClick={() => handleDelete(record)}
          />
        </div>
      ),
    },
  ];

  return (
    <Table
      size="middle"
      className="listProductDetails"
      columns={productColumns}
      dataSource={[...listDebtCustomer]}
      rowKey={(record) => record.id}
      loading={isLoading}
      scroll={{ x: "maxContent" }}
      // expandable={{
      //   expandedRowRender: (record) => (
      //     <>
      //       <Form.List name={[record.id, "productWarehouseDTOList"]}>
      //         {(fields, { add, remove }) => {
      //           if (fields.length > 0) {
      //             return (
      //               <div className="space-container">
      //                 {fields.map(({ key, name, ...restField }) => (
      //                   <Space
      //                     key={`${key}${name}`}
      //                     style={{
      //                       display: "flex",
      //                     }}
      //                     align="center"
      //                   >
      //                     <Form.Item
      //                       {...restField}
      //                       label="Warehouse"
      //                       name={[name, "wareHouseName"]}
      //                     >
      //                       <Input />
      //                     </Form.Item>

      //                     <Form.Item
      //                       {...restField}
      //                       label="Quantity"
      //                       name={[name, "quantityBox"]}
      //                     >
      //                       <Input />
      //                     </Form.Item>
      //                   </Space>
      //                 ))}
      //               </div>
      //             );
      //           } else {
      //             return <Text>The Details dont have any warehouse</Text>;
      //           }
      //         }}
      //       </Form.List>
      //     </>
      //   ),
      //   expandIcon: ({ expanded, onExpand, record }) => (
      //     <Tooltip placement="topRight" title={"Show warehouse select"}>
      //       {expanded ? (
      //         <CaretUpFilled
      //           style={{
      //             fontSize: "23px",
      //             transition: "all 0.3s ease",
      //           }}
      //           onClick={(e) => onExpand(record, e)}
      //         />
      //       ) : (
      //         <CaretDownFilled
      //           style={{
      //             fontSize: "23px",
      //             transition: "all 0.3s ease",
      //           }}
      //           onClick={(e) => onExpand(record, e)}
      //         />
      //       )}
      //     </Tooltip>
      //   ),
      // }}
      pagination={
        listDebtCustomer.length !== 0
          ? {
              showSizeChanger: true,
              position: ["bottomCenter"],
              size: "default",
              pageSize: pageSize,
              current: currentPage,
              total: listDebtCustomer.length,
              onChange: (page, size) => onHandlePagination(page, size),
              pageSizeOptions: ["2", "4", "10"],
            }
          : false
      }
    />
  );
}
