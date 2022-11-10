import {
  CaretDownFilled,
  CaretDownOutlined,
  CaretUpFilled,
  CaretUpOutlined,
  CloseOutlined,
  DeleteFilled,
  DeleteTwoTone,
  DownCircleTwoTone,
  DownOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
  MinusOutlined,
  PlusOutlined,
  RestTwoTone,
  SearchOutlined,
  UpCircleTwoTone,
} from "@ant-design/icons";
import {
  Avatar,
  Button,
  Col,
  Divider,
  Dropdown,
  Form,
  Input,
  InputNumber,
  Menu,
  Modal,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { get } from "lodash";
import Highlighter from "react-highlight-words";
import avt_default from "assets/images/avt-default.png";
import {
  updateListProductLv2,
  updateListProductLv3,
  updateProductImport,
} from "features/import-product/importProduct";
import "./ListProductImport.css";
import { unwrapResult } from "@reduxjs/toolkit";
import NewProductDetailsModal from "../NewProductDetailsModal/NewProductDetailsModal";
const { Option } = Select;
const { Text } = Typography;

export default function ListProductImport({ form }) {
  const { listWarehouses } = useSelector((state) => state.warehouse);
  const { productsImport, listProductLv2 } = useSelector(
    (state) => state.productImport
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
  const onRowDelete = (type, record) => {
    Modal.confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      content: "Delete can't revert, scarefully",
      okText: "Delete",
      cancelText: "Cancel",
      onOk: () => {
        switch (type) {
          case "deleteProduct":
            const newListProduct = productsImport.filter(
              (p) => p.index !== record.index && p.index !== record.index
            );
            dispatch(updateProductImport(newListProduct));
            break;
          case "deleteWarehouse":
            form.setFieldValue(
              [`${record.id}_${record.index}`, "warehouse"],
              []
            );
            form.setFieldValue(
              [`${record.id}_${record.index}`, "totalQuantityBox"],
              0
            );
            form.setFieldValue(
              [`${record.id}_${record.index}`, "totalSquareMeter"],
              0
            );
            form.setFieldValue(
              [`${record.id}_${record.index}`, "totalCostPrice"],
              0
            );
            onHandleCaculatorTotal();
            break;
        }
      },
      onCancel: () => {},
    });
  };

  const onHandleCaculatorTotal = () => {
    let totalQuantityBox = 0;
    let totalCostPrice = 0;

    productsImport.map((p) => {
      totalQuantityBox += form.getFieldValue([
        `${p.id}_${p.index}`,
        "totalQuantityBox",
      ]);
      totalCostPrice += form.getFieldValue([
        `${p.id}_${p.index}`,
        "totalCostPrice",
      ]);
    });

    form.setFieldValue("totalQuantityBox", totalQuantityBox);
    form.setFieldValue("totalCostPrice", parseFloat(totalCostPrice).toFixed(2));
  };
  const onHandleChangeQuantity = (record) => {
    const totalQuantityBox = form
      .getFieldValue([`${record.id}_${record.index}`, "warehouse"])
      .reduce(function (result, warehouse) {
        return result + warehouse?.quantityBox;
      }, 0);
    const costPerBox = form.getFieldValue([
      `${record.id}_${record.index}`,
      "costPerBox",
    ]);

    form.setFieldValue(
      [`${record.id}_${record.index}`, "totalQuantityBox"],
      totalQuantityBox
    );
    form.setFieldValue(
      [`${record.id}_${record.index}`, "totalSquareMeter"],
      parseFloat(totalQuantityBox * record.squareMeterPerBox).toFixed(2)
    );
    form.setFieldValue(
      [`${record.id}_${record.index}`, "totalCostPrice"],
      parseFloat(totalQuantityBox * costPerBox).toFixed(2)
    );
    onHandleCaculatorTotal();
  };
  const onHandleChangeCost = (record) => {
    const totalQuantityBox = form.getFieldValue([
      `${record.id}_${record.index}`,
      "totalQuantityBox",
    ]);

    if (totalQuantityBox) {
      const costPerBox = form.getFieldValue([
        `${record.id}_${record.index}`,
        "costPerBox",
      ]);

      form.setFieldValue(
        [`${record.id}_${record.index}`, "totalCostPrice"],
        parseFloat(costPerBox * totalQuantityBox).toFixed(2)
      );

      onHandleCaculatorTotal();
    }
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
      title: "Image",
      dataIndex: "image",
      key: "image",
      align: "center",
      fixed: "left",
      render: (_, record) => (
        <Avatar
          size={70}
          src={
            record.listImage[0].filePath === ""
              ? avt_default
              : record.listImage[0].filePath
          }
        />
      ),
    },
    {
      title: "Product Code",
      dataIndex: "id",
      key: "id",
      align: "center",
      sorter: (a, b) => a.id > b.id,
      sortDirections: ["descend", "ascend"],
      ...getColumnSearchProps("id"),
      render: (_, record) => (
        <Tag
          color="processing"
          style={{
            fontSize: "15px",
            padding: "0.5rem 1.2rem",
          }}
        >
          {record.id}
        </Tag>
      ),
    },
    {
      title: "Shipment",
      dataIndex: "shipment",
      key: "shipment",
      align: "center",
      render: (_, record) => (
        <Form.Item
          name={[`${record.id}_${record.index}`, "shipment"]}
          rules={[
            {
              required: true,
              message: "Missing shipment",
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                let a = productsImport.filter(
                  (p) =>
                    p.id === record.id &&
                    p.index !== record.index &&
                    getFieldValue([`${p.id}_${p.index}`, "shipment"]) === value
                );

                if (!value || a.length === 0) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error("The Shipment product be duplicated!")
                );
              },
            }),
          ]}
        >
          <Select
            onChange={(value) => {
              let productDetailsFilter = record.productDetailDTO?.filter(
                (item) => item.shipment === value
              );

              let ab = productsImport.map((product) => {
                if (
                  product.id === record.id &&
                  product.index === record.index
                ) {
                  return { ...record, productDetailDTO: productDetailsFilter };
                } else {
                  return product;
                }
              });

              form.setFieldValue([`${record.id}_${record.index}`, "type"], "");
              form.setFieldValue(
                [`${record.id}_${record.index}`, "color"],
                productDetailsFilter[0]?.color
              );
              dispatch(updateListProductLv2(ab));
            }}
            showSearch
            allowClear
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.value ?? "").includes(input)
            }
            filterSort={(optionA, optionB) =>
              (optionA?.value ?? "")
                .toLowerCase()
                .localeCompare((optionB?.value ?? "").toLowerCase())
            }
            style={{
              minWidth: 150,
            }}
          >
            {record.productDetailDTO?.map((item, index, arr) => {
              let listItem = arr.filter((i) => i.shipment === item.shipment);

              if (listItem[0].id === item.id) {
                return (
                  <Option
                    value={item.shipment}
                    key={`${item.id}_${item.shipment}`}
                  >
                    {item.shipment}
                  </Option>
                );
              }
            })}
          </Select>
        </Form.Item>
      ),
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      align: "center",
      render: (_, record) => (
        <Form.Item
          name={[`${record.id}_${record.index}`, "type"]}
          rules={[
            {
              required: true,
              message: "Missing Type",
            },
          ]}
        >
          <Select
            notFoundContent={null}
            style={{
              width: 120,
            }}
          >
            {listProductLv2.map((product) => {
              if (product.id === record.id && product.index === record.index) {
                return product.productDetailDTO?.map((item, index, arr) => {
                  let listItem = arr.filter((i) => i.type === item.type);
                  if (listItem[0].id === item.id) {
                    return (
                      <Option
                        value={`${item.id}_${item.type}`}
                        key={`${item.id}_${item.type}`}
                      >
                        {item.type}
                      </Option>
                    );
                  }
                });
              }
            })}
          </Select>
        </Form.Item>
      ),
    },
    {
      title: "Color",
      dataIndex: "color",
      key: "color",
      align: "center",
      render: (_, record) => (
        <Form.Item
          name={[`${record.id}_${record.index}`, "color"]}
          rules={[
            {
              required: true,
              message: "Missing Color",
            },
          ]}
        >
          <Input
            type="text"
            disabled={true}
            placeholder="Color"
            style={{
              width: 100,
              color: "black",
              borderStyle: "dashed",
            }}
          />
        </Form.Item>
      ),
    },
    {
      title: "Cost per box",
      dataIndex: "costPerBox",
      key: "costPerBox",
      align: "center",
      sorter: (a, b) =>
        parseFloat(form.getFieldValue([`${a.id}_${a.index}`, "costPerBox"])) <
        parseFloat(form.getFieldValue([`${b.id}_${b.index}`, "costPerBox"])),
      sortDirections: ["descend", "ascend"],
      render: (_, record) => (
        <Form.Item
          name={[`${record.id}_${record.index}`, "costPerBox"]}
          rules={[
            {
              required: true,
              message: "Missing Cost per box",
            },
          ]}
          onChange={() => onHandleChangeCost(record)}
          initialValue={1000}
        >
          <InputNumber
            min={1}
            placeholder={"cost"}
            onStep={() => onHandleChangeCost(record)}
          />
        </Form.Item>
      ),
    },
    {
      title: "Total Quantity Box",
      dataIndex: "totalQuantityBox",
      key: "totalQuantityBox",
      align: "center",
      sorter: (a, b) =>
        parseFloat(
          form.getFieldValue([`${a.id}_${a.index}`, "totalQuantityBox"])
        ) <
        parseFloat(
          form.getFieldValue([`${b.id}_${b.index}`, "totalQuantityBox"])
        ),
      sortDirections: ["descend", "ascend"],
      render: (_, record) => (
        <Form.Item
          name={[`${record.id}_${record.index}`, "totalQuantityBox"]}
          onChange={(value) => console.log(value)}
          initialValue={0}
        >
          <Statistic />
        </Form.Item>
      ),
    },
    {
      title: "Total Square Meter",
      dataIndex: "totalSquareMeter",
      key: "totalSquareMeter",
      align: "center",
      sorter: (a, b) =>
        parseFloat(
          form.getFieldValue([`${a.id}_${a.index}`, "totalSquareMeter"])
        ) <
        parseFloat(
          form.getFieldValue([`${b.id}_${b.index}`, "totalSquareMeter"])
        ),
      sortDirections: ["descend", "ascend"],
      render: (_, record) => (
        <Form.Item
          name={[`${record.id}_${record.index}`, "totalSquareMeter"]}
          onChange={(value) => console.log(value)}
          initialValue={0}
        >
          <Statistic />
        </Form.Item>
      ),
    },
    {
      title: "Total Cost Price",
      dataIndex: "totalCostPrice",
      key: "totalCostPrice",
      align: "center",
      sorter: (a, b) =>
        parseFloat(form.getFieldValue([`${a.id}_${a.index}`, "totalCostPrice"])) <
        parseFloat(form.getFieldValue([`${b.id}_${b.index}`, "totalCostPrice"])),
      sortDirections: ["descend", "ascend"],
      render: (_, record) => (
        <Form.Item
          name={[`${record.id}_${record.index}`, "totalCostPrice"]}
          onChange={(value) => console.log(value)}
          initialValue={0}
        >
          <Statistic />
        </Form.Item>
      ),
    },
    {
      title: "Actions",
      dataIndex: "operation",
      key: "operation",
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <div
          style={{
            display: "flex",
            gap: "3rem",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <NewProductDetailsModal record={record} />
          <Tooltip title="remove product" color={"magenta"}>
            <CloseOutlined
              onClick={() => onRowDelete("deleteProduct", record)}
              style={{ fontSize: "23px", cursor: "pointer", color: "#eb2f96" }}
            />
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <Table
      size="middle"
      className="listProductImport"
      columns={productColumns}
      dataSource={[...productsImport]}
      rowKey={(record) => `${record.id}-${record.index}`}
      loading={isLoading}
      scroll={{
        x: 1700,
      }}
      expandable={{
        expandedRowRender: (record) => (
          <>
            <Form.List name={[`${record.id}_${record.index}`, "warehouse"]}>
              {(fields, { add, remove }) => (
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
                          name={[name, "warehouseId"]}
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
                                ]).filter((item) => item.warehouseId === value);

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
                            {listWarehouses.map((item) => (
                              <Option key={item.id} value={item.id}>
                                {item.warehouseName}
                              </Option>
                            ))}
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
                          ]}
                          onChange={() => onHandleChangeQuantity(record)}
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
                    {fields.length < listWarehouses.length ? (
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        Add new select Warehouse
                      </Button>
                    ) : (
                      <Button
                        type="dashed"
                        onClick={() => onRowDelete("deleteWarehouse", record)}
                        block
                        style={{ color: "red" }}
                        icon={<RestTwoTone twoToneColor="red" />}
                      >
                        Delete all select Warehouse
                      </Button>
                    )}
                  </Form.Item>
                </>
              )}
            </Form.List>
          </>
        ),
        expandIcon: ({ expanded, onExpand, record }) =>
          expanded ? (
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
          ),
      }}
      pagination={
        productsImport.length !== 0
          ? {
              showSizeChanger: true,
              position: ["bottomCenter"],
              size: "default",
              pageSize: pageSize,
              current: currentPage,
              total: productsImport.length,
              onChange: (page, size) => onHandlePagination(page, size),
              pageSizeOptions: ["2", "4", "6"],
            }
          : false
      }
    />
  );
}
