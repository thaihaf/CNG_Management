import {
  CaretDownFilled,
  CaretUpFilled,
  DownOutlined,
  ExclamationCircleOutlined,
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
  updateDetails,
} from "features/product-manager/productManager";
import { unwrapResult } from "@reduxjs/toolkit";

const { Option } = Select;
const { Text, Title } = Typography;

export default function TableDetails({ form, updateMode, openHeader }) {
  const { listWarehouses } = useSelector((state) => state.warehouse);
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
      title: "Delete Product Details",
      icon: <ExclamationCircleOutlined />,
      content: `Delete Product Details can't revert, scarefully`,
      okText: "Delete",
      cancelText: "Cancel",
      onOk: () => {
        setIsLoading(true);
        dispatch(deleteDetailsProduct(record?.id))
          .then(unwrapResult)
          .then((res) => {
            console.log(res)
            updateDetails(record);

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
      title: "Shipment",
      dataIndex: "shipment",
      key: "shipment",
      align: "center",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      align: "center",
    },
    {
      title: "Cost Per Square Meter (vnđ)",
      dataIndex: "costPerSquareMeter",
      key: "costPerSquareMeter",
      align: "center",
      sorter: (a, b) =>
        parseFloat(a.costPerSquareMeter) < parseFloat(b.costPerSquareMeter),
      sortDirections: ["descend", "ascend"],
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      align: "center",
      //   filters: statusProductExport.map((item) => {
      //     return { key: item.key, value: item.value, text: item.label };
      //   }),
      onFilter: (value, record) => record.status === value,
      filterSearch: true,
      render: (s) => {
        let color = s == 1 ? "green" : "volcano";
        let text = s == 1 ? "Active" : "Inactive";

        return (
          <Tag color={color} key={s}>
            {text}
          </Tag>
        );
      },
      sorter: (a, b) => a.status - b.status,
      sortDirections: ["descend", "ascend"],
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
          <DetailsModal record={record} type="edit" />
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
      dataSource={[...detailDTOList]}
      rowKey={(record) => record.id}
      loading={isLoading}
      scroll={{ x: "maxContent" }}
      expandable={{
        expandedRowRender: (record) => (
          <>
            {/* <Form.List name={[`${record.id}_${record.index}`, "warehouse"]}>
              {(fields, { add, remove }) => {
                let detailID = form
                  .getFieldValue([`${record.id}_${record.index}`, "type"])
                  ?.split("_")[0];

                let productDetailDTO = record.productDetailDTO.find(
                  (item) => item.id.toString() === detailID
                );
                let maxLength =
                  productDetailDTO?.productWarehouseDTOList?.filter(
                    (item) => item.quantityBox > 0
                  )?.length;

                return (
                  <>
                    <div className="space-container">
                      {fields.map(({ key, name, ...restField }) => (
                        <Space
                          key={`${key}${name}`}
                          style={{
                            display: "flex",
                          }}
                          align="center"
                        >
                          <Form.Item
                            {...restField}
                            label="Warehouse"
                            name={[name, "productWarehouseId"]}
                            rules={[
                              {
                                required: true,
                                message: "Missing warehouse",
                              },
                              ({ getFieldValue }) => ({
                                validator(_, value) {
                                  let checkExist = getFieldValue([
                                    `${record.id}_${record.index}`,
                                    "warehouse",
                                  ]).filter(
                                    (item) => item.productWarehouseId === value
                                  );

                                  if (!value || checkExist.length === 1) {
                                    return Promise.resolve();
                                  }
                                  return Promise.reject(
                                    new Error("The Warehouse be duplicated!")
                                  );
                                },
                              }),
                            ]}
                          >
                            <Select
                              style={{
                                width: 200,
                              }}
                            >
                              {productDetailDTO?.productWarehouseDTOList?.map(
                                (item) => (
                                  <Option
                                    key={item.id}
                                    value={item.id}
                                    disabled={item.quantityBox <= 0}
                                  >
                                    {item.wareHouseName}
                                  </Option>
                                )
                              )}
                            </Select>
                          </Form.Item>

                          <Form.Item
                            {...restField}
                            label="Quantity"
                            name={[name, "quantityBox"]}
                            rules={[
                              {
                                required: true,
                                message: "Missing quantity",
                              },
                              ({ getFieldValue }) => ({
                                validator(_, value) {
                                  let wId = form.getFieldValue([
                                    `${record.id}_${record.index}`,
                                    "warehouse",
                                    name,
                                  ])?.productWarehouseId;

                                  let warehouse =
                                    productDetailDTO?.productWarehouseDTOList?.find(
                                      (item) => item.id === wId
                                    );

                                  if (!wId) {
                                    return Promise.reject(
                                      new Error(
                                        "Must be choose Warehouse first"
                                      )
                                    );
                                  }

                                  if (value > warehouse?.quantityBox) {
                                    return Promise.reject(
                                      new Error(
                                        `The maximum Quantity is ${warehouse?.quantityBox}`
                                      )
                                    );
                                  }

                                  return Promise.resolve();
                                },
                              }),
                            ]}
                            onChange={() => onHandleChangeQuantity(record)}
                            initialValue={1}
                          >
                            <InputNumber
                              min={1}
                              max={10000}
                              onStep={() => onHandleChangeQuantity(record)}
                            />
                          </Form.Item>

                          <MinusCircleOutlined
                            onClick={() => {
                              remove(name);
                              onHandleChangeQuantity(record);
                            }}
                            style={{
                              fontSize: "25px",
                              transition: "all 0.3s ease",
                            }}
                          />
                        </Space>
                      ))}
                    </div>

                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => {
                          add();
                          onHandleChangeQuantity(record);
                        }}
                        block
                        icon={<PlusOutlined />}
                        disabled={
                          !detailID || !maxLength || fields.length === maxLength
                        }
                      >
                        Add new select Warehouse
                      </Button>
                    </Form.Item>
                  </>
                );
              }}
            </Form.List> */}
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
      pagination={
        detailDTOList.length !== 0
          ? {
              showSizeChanger: true,
              position: ["bottomCenter"],
              size: "default",
              pageSize: pageSize,
              current: currentPage,
              total: detailDTOList.length,
              onChange: (page, size) => onHandlePagination(page, size),
              pageSizeOptions: ["2", "4", "10"],
            }
          : false
      }
    />
  );
}
