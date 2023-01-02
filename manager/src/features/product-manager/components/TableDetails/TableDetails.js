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
  notification,
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

const { Option } = Select;
const { Text, Title } = Typography;

export default function TableDetails({ form }) {
  const { productDetails, detailDTOList } = useSelector(
    (state) => state.product
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
      title: "Xoá Lô hàng và loại sản phẩm",
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn xoá Lô hàng và loại sản phẩm không?`,
      okText: "Xoá bỏ",
      cancelText: "Huỷ bỏ",
      onOk: () => {
        setIsLoading(true);
        dispatch(deleteDetailsProduct(record?.id))
          .then(unwrapResult)
          .then((res) => {
            let ab = detailDTOList.map((item) => {
              if (item.id === record.id) {
                return { ...item, status: 0 };
              } else {
                return item;
              }
            });

            dispatch(updateProductDetails(ab));
            setIsLoading(false);
            notification.success({
              message: "Lô hàng và loại sản phẩm",
              description: "Xoá Lô hàng và loại sản phẩm thành công!",
            });
          })
          .catch((error) => {
            setIsLoading(false);
            notification.error({
              message: "Lô hàng và loại sản phẩm",
              description: "Xoá Lô hàng và loại sản phẩm thất bại",
            });
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

  useEffect(() => {
    detailDTOList.map((item) => {
      form.setFieldValue(
        [item.id, "productWarehouseDTOList"],
        item.productWarehouseDTOList
      );
    });
  }, [dispatch, detailDTOList, productDetails]);

  const columns = [
    {
      title: "Số lô",
      dataIndex: "shipment",
      key: "shipment",
      align: "center",
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      align: "center",
    },
    {
      title: "Giá/M2 (VND)",
      dataIndex: "costPerSquareMeter",
      key: "costPerSquareMeter",
      align: "center",
    },
    {
      title: "Số hộp",
      dataIndex: "totalQuantityBox",
      key: "totalQuantityBox",
      align: "center",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      align: "center",
      render: (s) => {
        let color = s == 1 ? "green" : "volcano";
        let text = s == 1 ? "Hoạt động" : "Không hoạt động";

        return (
          <Tag color={color} key={s}>
            {text}
          </Tag>
        );
      },
    },
    {
      title: "Hành động",
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
          <DetailsModal record={record} type="edit" />
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
            onClick={() => handleDelete(record)}
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
        </div>
      ),
    },
  ];

  return (
    <Table
      size="middle"
      bordered
      className="table-shipment-types"
      columns={columns}
      rowClassName={(record, index) =>
        index % 2 === 0 ? "table-row table-row-even" : "table-row table-row-odd"
      }
      dataSource={[...detailDTOList]}
      rowKey={(record) => record.id}
      loading={isLoading}
      scroll={{ x: "maxContent" }}
      expandable={{
        expandedRowRender: (record) => (
          <>
            <Form.List name={[record.id, "productWarehouseDTOList"]}>
              {(fields, { add, remove }) => {
                if (fields.length > 0) {
                  return (
                    <div className="warehouse-list">
                      {fields.map(({ key, name, ...restField }) => (
                        <Space
                          key={`${key}${name}`}
                          align="center"
                          className="wapper"
                        >
                          <Form.Item
                            {...restField}
                            label={`Kho hàng ${name + 1}`}
                            name={[name, "wareHouseName"]}
                          >
                            <Input disabled />
                          </Form.Item>

                          <Form.Item
                            {...restField}
                            label="Số lượng"
                            name={[name, "quantityBox"]}
                          >
                            <Input disabled />
                          </Form.Item>
                        </Space>
                      ))}
                    </div>
                  );
                } else {
                  return (
                    <Text>
                      Số lô và loại sản phẩm này chưa có trong Kho hàng nào
                    </Text>
                  );
                }
              }}
            </Form.List>
          </>
        ),
        expandIcon: ({ expanded, onExpand, record }) => (
          <Tooltip placement="topRight" title={"Show warehouse select"}>
            {expanded ? (
              <CaretUpFilled
                style={{
                  fontSize: "23px",
                  transition: "all 0.3s ease",
                }}
                onClick={(e) => onExpand(record, e)}
              />
            ) : (
              <CaretDownFilled
                style={{
                  fontSize: "23px",
                  transition: "all 0.3s ease",
                }}
                onClick={(e) => onExpand(record, e)}
              />
            )}
          </Tooltip>
        ),
      }}
      pagination={false}
    />
  );
}
