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
  DatePicker,
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
  Spin,
  Statistic,
  Table,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { get } from "lodash";
import Highlighter from "react-highlight-words";
import avt_default from "assets/images/avt-default.png";
import {
  updateListProductLv2,
  updateListProductLv3,
  updateProductImport,
} from "features/import-product/importProduct";
import "./InsertProductTable.css";
import { unwrapResult } from "@reduxjs/toolkit";
import NewProductDetailsModal from "../NewProductDetailsModal/NewProductDetailsModal";
import { getMessage } from "helpers/util.helper";
import { CODE_ERROR } from "constants/errors.constants";
import { MESSAGE_ERROR } from "constants/messages.constants";
import { getEmployees } from "features/employee-manager/employeeManager";
import HeaderTable from "../HeaderTable/HeaderTable";

const { Option } = Select;
const { Text, Title } = Typography;

export default function InsertProductTable({ form, updateMode, openHeader }) {
  const { listWarehouses } = useSelector((state) => state.warehouse);
  const { productsImport, listProductLv2, productImportDetails } = useSelector(
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
              [`${record.id}_${record.index}`, "costPerSquareMeter"],
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
    let totalQuantityImport = 0;
    let totalSquareMeterImport = 0;
    let totalCostImport = 0;

    productsImport.map((p) => {
      totalQuantityImport += form.getFieldValue([
        `${p.id}_${p.index}`,
        "totalQuantityBox",
      ]);
      totalSquareMeterImport += form.getFieldValue([
        `${p.id}_${p.index}`,
        "totalSquareMeter",
      ]);
      totalCostImport += form.getFieldValue([
        `${p.id}_${p.index}`,
        "totalCost",
      ]);
    });

    form.setFieldValue("totalQuantityImport", totalQuantityImport);
    form.setFieldValue("totalSquareMeterImport", totalSquareMeterImport);
    form.setFieldValue("totalCostImport", totalCostImport);
  };
  const onHandleChangeQuantity = (record) => {
    const totalQuantityBox = form
      .getFieldValue([`${record.id}_${record.index}`, "warehouse"])
      .reduce(function (result, warehouse) {
        return result + warehouse?.quantityBox;
      }, 0);
    const costPerSquareMeter = form.getFieldValue([
      `${record.id}_${record.index}`,
      "costPerSquareMeter",
    ]);

    const totalSquareMeter = totalQuantityBox * record.squareMeterPerBox;
    const totalCost = totalSquareMeter * costPerSquareMeter;

    form.setFieldValue(
      [`${record.id}_${record.index}`, "totalQuantityBox"],
      totalQuantityBox
    );
    form.setFieldValue(
      [`${record.id}_${record.index}`, "totalSquareMeter"],
      totalSquareMeter
    );
    form.setFieldValue(
      [`${record.id}_${record.index}`, "totalCost"],
      totalCost
    );
    onHandleCaculatorTotal();
  };
  const onHandleChangeCost = (record, value) => {
    const totalQuantityBox = form.getFieldValue([
      `${record.id}_${record.index}`,
      "totalQuantityBox",
    ]);

    if (totalQuantityBox) {
      const costPerSquareMeter =
        typeof value === "number" ? value : Number(value.target.value);

      form.setFieldValue(
        [`${record.id}_${record.index}`, "totalCost"],
        record.squareMeterPerBox * totalQuantityBox * costPerSquareMeter
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
      title: "Index",
      dataIndex: "index",
      key: "index",
      align: "center",
      sorter: (a, b) => a.index > b.index,
      sortDirections: ["descend", "ascend"],
      ...getColumnSearchProps("index"),
      render: (_, record) => <Title level={4}>{record.index}</Title>,
    },
    {
      title: "Product",
      dataIndex: "id",
      key: "id",
      align: "center",
      sorter: (a, b) => a.id > b.id,
      sortDirections: ["descend", "ascend"],
      ...getColumnSearchProps("id"),
      render: (_, record) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "1.5rem",
            width: "maxContent",
          }}
        >
          <Avatar
            size={70}
            src={
              record.listImage[0].filePath === ""
                ? avt_default
                : record.listImage[0].filePath
            }
          />
          <div
            style={{
              paddingRight: "2rem",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: "0.8rem",
              width: "maxContent",
            }}
          >
            <div
              style={{
                fontSize: "17px",
                fontWeight: "600",
              }}
            >
              {record.productName}
            </div>
            <div
              style={{
                display: "flex",
                gap: "0.6rem",
                width: "maxContent",
              }}
            >
              <div className="">{`ID: `}</div>
              <div className="">{record.id}</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Product Details",
      dataIndex: "productDetails",
      key: "productDetails",
      align: "center",
      render: (_, record) => (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: "1rem",
          }}
        >
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
                      getFieldValue([`${p.id}_${p.index}`, "shipment"]) ===
                        value
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
            style={{
              minWidth: 200,
            }}
          >
            <Select
              placeholder="Shipment"
              onChange={(value) => {
                let productDetailsFilter = record.productDetailDTO?.filter(
                  (item) => item.shipment === value
                );

                let ab = productsImport.map((product) => {
                  if (
                    product.id === record.id &&
                    product.index === record.index
                  ) {
                    return {
                      ...record,
                      productDetailDTO: productDetailsFilter,
                    };
                  } else {
                    return product;
                  }
                });

                form.setFieldValue(
                  [`${record.id}_${record.index}`, "type"],
                  ""
                );
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

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "2rem",
            }}
          >
            <Form.Item
              name={[`${record.id}_${record.index}`, "type"]}
              rules={[
                {
                  required: true,
                  message: "Missing Type",
                },
              ]}
              style={{
                minWidth: 100,
              }}
            >
              <Select placeholder="Type" notFoundContent={null}>
                {listProductLv2.map((product) => {
                  if (
                    product.id === record.id &&
                    product.index === record.index
                  ) {
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
            <Form.Item
              name={[`${record.id}_${record.index}`, "color"]}
              rules={[
                {
                  required: true,
                  message: "Missing Color",
                },
              ]}
              style={{
                minWidth: 100,
              }}
            >
              <Input
                type="text"
                disabled={true}
                placeholder="Color"
                style={{
                  color: "black",
                  borderStyle: "dashed",
                }}
              />
            </Form.Item>
          </div>
        </div>
      ),
    },
    {
      title: "Cost Per Square Meter (vnđ)",
      dataIndex: "costPerSquareMeter",
      key: "costPerSquareMeter",
      align: "center",
      sorter: (a, b) =>
        parseFloat(
          form.getFieldValue([`${a.id}_${a.index}`, "costPerSquareMeter"])
        ) <
        parseFloat(
          form.getFieldValue([`${b.id}_${b.index}`, "costPerSquareMeter"])
        ),
      sortDirections: ["descend", "ascend"],
      render: (_, record) => (
        <Form.Item
          name={[`${record.id}_${record.index}`, "costPerSquareMeter"]}
          rules={[
            {
              required: true,
              message: "Missing Cost Per Square Meter",
            },
          ]}
          onChange={(value) => onHandleChangeCost(record, value)}
          initialValue={1000}
          style={{
            minWidth: 150,
          }}
        >
          <InputNumber
            min={1}
            onStep={(value) => onHandleChangeCost(record, value)}
          />
        </Form.Item>
      ),
    },
    {
      title: "Quantity Box",
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
          style={{ minWidth: "150px" }}
        >
          <Statistic />
        </Form.Item>
      ),
    },
    {
      title: "Square Meter (m2)",
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
          style={{ minWidth: "150px" }}
        >
          <Statistic />
        </Form.Item>
      ),
    },
    {
      title: "Cost (vnđ)",
      dataIndex: "totalCost",
      key: "totalCost",
      align: "center",
      sorter: (a, b) =>
        parseFloat(form.getFieldValue([`${a.id}_${a.index}`, "totalCost"])) <
        parseFloat(form.getFieldValue([`${b.id}_${b.index}`, "totalCost"])),
      sortDirections: ["descend", "ascend"],
      render: (_, record) => (
        <Form.Item
          name={[`${record.id}_${record.index}`, "totalCost"]}
          onChange={(value) => console.log(value)}
          initialValue={0}
        >
          <Statistic style={{ minWidth: "150px" }} />
        </Form.Item>
      ),
    },
    {
      title: "Product Note",
      dataIndex: "noteImport",
      key: "noteImport",
      align: "center",
      render: (_, record) => (
        <Form.Item name={[`${record.id}_${record.index}`, "noteImport"]}>
          <Input.TextArea
            showCount
            maxLength={300}
            style={{ height: "100%", resize: "none", minWidth: "150px" }}
            placeholder="Product note"
          />
        </Form.Item>
      ),
    },
    {
      title: "Actions",
      dataIndex: "operation",
      key: "operation",
      align: "center",
      width: 120,
      render: (_, record) => (
        <Dropdown
          overlay={
            <Menu
              items={[
                {
                  key: 1,
                  label: <NewProductDetailsModal record={record} />,
                },
                {
                  key: 2,
                  label: "Remove Product",
                  onClick: () => onRowDelete("deleteProduct", record),
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

  return (
    <Table
      size="middle"
      className={
        openHeader ? "listProductImport tranform" : "listProductImport"
      }
      columns={productColumns}
      dataSource={[...productsImport]}
      rowKey={(record) => `${record.id}-${record.index}`}
      loading={isLoading}
      scroll={{ x: "maxContent" }}
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
        productsImport.length !== 0
          ? {
              showSizeChanger: true,
              position: ["bottomCenter"],
              size: "default",
              pageSize: pageSize,
              current: currentPage,
              total: productsImport.length,
              onChange: (page, size) => onHandlePagination(page, size),
              pageSizeOptions: ["2", "5", "10"],
            }
          : false
      }
      title={() => <HeaderTable form={form} updateMode={updateMode} />}
    />
  );
}
