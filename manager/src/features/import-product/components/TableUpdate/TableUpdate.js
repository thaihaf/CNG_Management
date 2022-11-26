import {
  AppstoreOutlined,
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
  message,
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
  deleteProductImportDetail,
  deleteProductImportDetailWarehouse,
} from "features/import-product/importProduct";
import "./TableUpdate.css";
import { unwrapResult } from "@reduxjs/toolkit";
import NewProductDetailsModal from "../NewProductDetailsModal/NewProductDetailsModal";
import { getMessage } from "helpers/util.helper";
import { CODE_ERROR } from "constants/errors.constants";
import { MESSAGE_ERROR } from "constants/messages.constants";
import { getEmployees } from "features/employee-manager/employeeManager";
import HeaderTable from "../HeaderTable/HeaderTable";
import { getDetailsProduct } from "features/product-manager/productManager";
import SearchProduct from "../SearchProduct/SearchProduct";

const { Option } = Select;
const { Text, Title } = Typography;

export default function TableUpdate({ form, updateMode, openHeader }) {
  const { listWarehouses } = useSelector((state) => state.warehouse);
  const { productDetails } = useSelector((state) => state.product);
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

  const [editingKey, setEditingKey] = useState(null);
  const [editingValue, setEditingValue] = useState(null);
  const isEditing = (record) =>
    record.index === editingKey || typeof record.id === "string";

  const onHandlePagination = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };

  const onHandleCaculatorTotal = (newList) => {
    let totalQuantityImport = 0;
    let totalSquareMeterImport = 0;
    let totalCostImport = 0;

    let initialList = productsImport;
    if (newList) {
      initialList = newList;
    }

    initialList.map((p) => {
      const id =
        typeof p.id === "string"
          ? p.id
          : p.productDetailDTO?.productId ?? p.productDetailDTO[0].productId;
      const index = p.index;

      totalQuantityImport += form.getFieldValue([
        `${id}_${index}`,
        "totalQuantityBox",
      ]);
      totalSquareMeterImport += form.getFieldValue([
        `${id}_${index}`,
        "totalSquareMeter",
      ]);
      totalCostImport += form.getFieldValue([`${id}_${index}`, "totalCost"]);
    });

    form.setFieldValue("totalQuantityImport", totalQuantityImport);
    form.setFieldValue("totalSquareMeterImport", totalSquareMeterImport);
    form.setFieldValue("totalCostImport", totalCostImport);
  };
  const onHandleChangeQuantity = (record) => {
    const id =
      typeof record.id === "string"
        ? record.id
        : record.productDetailDTO?.productId ??
          record.productDetailDTO[0].productId;
    const index = record.index;

    const totalQuantityBox = form
      .getFieldValue([`${id}_${index}`, "warehouse"])
      .reduce(function (result, warehouse) {
        let q = warehouse === undefined ? 1 : warehouse?.quantityBox;
        return result + q;
      }, 0);
    const costPerSquareMeter = form.getFieldValue([
      `${id}_${index}`,
      "costPerSquareMeter",
    ]);

    const totalSquareMeter = totalQuantityBox * record.squareMeterPerBox;
    const totalCost = totalSquareMeter * costPerSquareMeter;

    form.setFieldValue(
      [`${id}_${index}`, "totalQuantityBox"],
      totalQuantityBox
    );
    form.setFieldValue(
      [`${id}_${index}`, "totalSquareMeter"],
      totalSquareMeter
    );
    form.setFieldValue([`${id}_${index}`, "totalCost"], totalCost);
    onHandleCaculatorTotal();
  };
  const onHandleChangeCost = (record, value) => {
    const id =
      typeof record.id === "string"
        ? record.id
        : record.productDetailDTO?.productId ??
          record.productDetailDTO[0].productId;
    const index = record.index;

    const totalQuantityBox = form.getFieldValue([
      `${id}_${index}`,
      "totalQuantityBox",
    ]);

    if (totalQuantityBox) {
      const costPerSquareMeter =
        typeof value === "number" ? value : Number(value.target.value);

      form.setFieldValue(
        [`${id}_${index}`, "totalCost"],
        record.squareMeterPerBox * totalQuantityBox * costPerSquareMeter
      );

      onHandleCaculatorTotal();
    }
  };

  const onRowDelete = (type, record) => {
    const id =
      typeof record.id === "string"
        ? record.id
        : record.productDetailDTO?.productId ??
          record.productDetailDTO[0].productId;
    const index = record.index;

    Modal.confirm({
      title: "Delete Product",
      icon: <ExclamationCircleOutlined />,
      content:
        "Are you really want to Delete Product? Action can't revert, scarefully",
      okText: "Delete",
      cancelText: "Cancel",
      onOk: () => {
        switch (type) {
          case "deleteProduct":
            if (typeof record.id === "number") {
              setIsLoading(true);
              dispatch(deleteProductImportDetail(record.id))
                .then(unwrapResult)
                .then((res) => {
                  //v1
                  const newListProduct = productsImport.filter(
                    (p) => p.index !== record.index
                  );
                  const newListProduct1 = newListProduct.map((item, index) => {
                    return { ...item, index: index + 1 };
                  });

                  //v2
                  const newListProductv2 = listProductLv2.filter(
                    (p) => p.index !== record.index
                  );
                  const newListProductv2_1 = newListProductv2.map(
                    (item, index) => {
                      return { ...item, index: index + 1 };
                    }
                  );
                  dispatch(updateProductImport(newListProduct1));
                  dispatch(updateListProductLv2(newListProductv2_1));
                  message.success(
                    "Delete Product Import Deatails Successfully"
                  );
                  setIsLoading(false);
                  onHandleCaculatorTotal(newListProduct);
                })
                .catch((err) => {
                  setIsLoading(false);
                  console.log(err);
                });
            } else {
              const newListProduct = productsImport.filter(
                (p) => p.index !== record.index
              );
              const newListProduct1 = newListProduct.map((item, index) => {
                return { ...item, index: index + 1 };
              });
              dispatch(updateProductImport(newListProduct1));
              onHandleCaculatorTotal(newListProduct);
            }
            break;
          case "deleteWarehouse":
            form.setFieldValue([`${id}_${index}`, "warehouse"], []);
            form.setFieldValue([`${id}_${index}`, "totalQuantityBox"], 0);
            form.setFieldValue([`${id}_${index}`, "totalSquareMeter"], 0);
            form.setFieldValue([`${id}_${index}`, "totalCost"], 0);
            break;
        }
      },
      onCancel: () => {},
    });
  };
  const onRowEdit = (record) => {
    const id =
      typeof record.id === "string"
        ? record.id
        : record.productDetailDTO?.productId ??
          record.productDetailDTO[0].productId;
    const index = record.index;

    setEditingKey(index);

    if (typeof record.id === "number") {
      setIsLoading(true);
      setEditingValue(record.productDetailDTO);

      dispatch(getDetailsProduct(id))
        .then(unwrapResult)
        .then((res) => {
          const shipmentVal = form.getFieldValue([
            `${id}_${index}`,
            "shipment",
          ]);

          //v1
          let ab = productsImport.map((product) => {
            if (product.index === record.index) {
              return {
                ...record,
                listImage: res.listImage,
                squareMeterPerBox: res.squareMeterPerBox,
                productDetailDTO: res.productDetailDTO,
              };
            } else {
              return product;
            }
          });

          // v2
          let productDetailsFilter = res.productDetailDTO?.filter(
            (item) => item.shipment === shipmentVal
          );
          let abc = productsImport.map((product) => {
            if (product.index === record.index) {
              return {
                ...record,
                productDetailDTO: productDetailsFilter,
              };
            } else {
              return product;
            }
          });

          dispatch(updateProductImport(ab));
          dispatch(updateListProductLv2(abc));
          setIsLoading(false);
        });
    }
  };
  const onHanldeDeleteWarehouse = (name, record, callback) => {
    const id =
      typeof record.id === "string"
        ? record.id
        : record.productDetailDTO?.productId ??
          record.productDetailDTO[0].productId;
    const index = record.index;

    const warehouse = form.getFieldValue([`${id}_${index}`, "warehouse", name]);
    const warehouseInDB = form
      .getFieldValue([`${id}_${index}`, "warehouse"])
      .filter((item) => item?.id);

    if (warehouse.id && warehouseInDB.length > 1) {
      Modal.confirm({
        title: "Delete Product",
        icon: <ExclamationCircleOutlined />,
        content:
          "Are you really want to Delete Product Warehouse? Action can't revert, scarefully",
        okText: "Delete",
        cancelText: "Cancel",
        onOk: () => {
          setIsLoading(true);
          dispatch(deleteProductImportDetailWarehouse(warehouse.id))
            .then((res) => {
              message.success("Delete Warehouse successfully");
              callback(name);
              onHandleChangeQuantity(record);
              setIsLoading(false);
            })
            .catch((err) => {
              console.log(err);
              setIsLoading(false);
            });
        },
        onCancel: () => {},
      });
    } else {
      const warehouseNotInDB = form
        .getFieldValue([`${id}_${index}`, "warehouse"])
        .filter((item) => !item?.id);

      if (warehouse.id) {
        form.setFieldValue([`${id}_${index}`, "warehouse", 1], {
          ...warehouseNotInDB[0],
          id: warehouse.id,
        });
      }
      callback(name);
      onHandleChangeQuantity(record);
    }

    // console.log(form.getFieldValue([`${id}_${index}`, "warehouse"]));
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
  const getColumnSearchProps = (placeholder, dataIndex, nestedValue) => ({
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
          placeholder={`Search ${placeholder}`}
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
      ...getColumnSearchProps("index", "index"),
      render: (_, record) => <Title level={4}>{record.index}</Title>,
    },
    {
      title: "Product",
      dataIndex: "id",
      key: "id",
      align: "center",
      sorter: (a, b) =>
        a.productDetailDTO.productId > b.productDetailDTO.productId,
      sortDirections: ["descend", "ascend"],
      ...getColumnSearchProps("product ID", "productDetailDTO", "productId"),
      render: (_, record) => {
        const id =
          typeof record.id === "string"
            ? record.id
            : record.productDetailDTO?.productId ??
              record.productDetailDTO[0].productId;

        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1.5rem",
              padding: "0 1.5rem",
            }}
          >
            <Avatar
              size={70}
              src={
                record.listImage || !record.productDetailDTO?.fileAttachDTOList
                  ? record.listImage[0].filePath
                  : record.productDetailDTO?.fileAttachDTOList[0].filePath ??
                    avt_default
              }
            />
            <div
              style={{
                paddingRight: "2rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                gap: "0.5rem",
                width: "maxContent",
              }}
            >
              <div
                style={{
                  fontSize: "17px",
                  fontWeight: "600",
                }}
              >
                {id}
              </div>
            </div>
          </div>
        );
      },
    },
    {
      title: "Product Details",
      dataIndex: "productDetails",
      key: "productDetails",
      align: "center",
      render: (_, record) => {
        const id =
          typeof record.id === "string"
            ? record.id
            : record.productDetailDTO?.productId ??
              record.productDetailDTO[0].productId;
        const index = record.index;
        const typeOfInitialValues = form.getFieldValue([
          `${id}_${index}`,
          "type",
        ]);

        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: "1rem",
              padding: "0 1.5rem",
            }}
          >
            <Form.Item
              name={[`${id}_${index}`, "shipment"]}
              rules={[
                {
                  required: true,
                  message: "Missing shipment",
                },
              ]}
              style={{
                minWidth: 150,
              }}
            >
              {record.productDetailDTO?.length && isEditing(record) ? (
                <Select
                  placeholder="Shipment"
                  onChange={(value) => {
                    let productDetailsFilter = record.productDetailDTO?.filter(
                      (item) => item.shipment === value
                    );
                    let ab = productsImport.map((product) => {
                      if (product.index === record.index) {
                        return {
                          ...record,
                          productDetailDTO: productDetailsFilter,
                        };
                      } else {
                        return product;
                      }
                    });

                    form.setFieldValue([`${id}_${index}`, "type"]);

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
                    let listItem = arr.filter(
                      (i) => i.shipment === item.shipment
                    );
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
              ) : (
                <Input
                  type="text"
                  disabled
                  placeholder="Shipment"
                  style={{
                    color: "black",
                  }}
                />
              )}
            </Form.Item>

            <Form.Item
              name={[`${id}_${index}`, "type"]}
              rules={[
                {
                  required: true,
                  message: "Missing Type",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    let a = productsImport.filter((p) => {
                      const productIdTemp =
                        typeof p.id === "string"
                          ? p.id
                          : p.productDetailDTO?.productId ??
                            p.productDetailDTO[0].productId;

                      return (
                        productIdTemp === id &&
                        p.index !== index &&
                        getFieldValue([
                          `${productIdTemp}_${p.index}`,
                          "type",
                        ]) === value
                      );
                    });

                    if (!value || a.length === 0) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error("Product Details duplicated!")
                    );
                  },
                }),
              ]}
              style={{
                minWidth: 100,
                width: "100%",
              }}
            >
              <Select
                placeholder="Type"
                notFoundContent={null}
                onChange={(value, option) => {
                  listProductLv2.map((product) => {
                    const pid =
                      typeof product.id === "string"
                        ? product.id
                        : product.productDetailDTO?.productId ??
                          product.productDetailDTO[0].productId;

                    if (product.index === index && pid === id) {
                      const a = product.productDetailDTO?.find(
                        (item) => item.id === option.id
                      );
                    }
                  });
                }}
                disabled={!isEditing(record)}
              >
                {record.productDetailDTO?.length && isEditing(record) ? (
                  listProductLv2.map((product) => {
                    const pid =
                      typeof product.id === "string"
                        ? product.id
                        : product.productDetailDTO?.productId ??
                          product.productDetailDTO[0].productId;

                    if (product.index === index && pid === id) {
                      return product.productDetailDTO?.map(
                        (item, index, arr) => {
                          let listItem = arr.filter(
                            (i) => i.type === item.type
                          );
                          if (listItem[0].id === item.id) {
                            return (
                              <Option
                                value={`${item.id}_${item.type}`}
                                key={`${item.id}_${item.type}`}
                                id={item.id}
                              >
                                {item.type}
                              </Option>
                            );
                          }
                        }
                      );
                    }
                  })
                ) : (
                  <Option value={typeOfInitialValues || ""}>
                    {typeOfInitialValues?.split("_")[1]}
                  </Option>
                )}
              </Select>
            </Form.Item>
          </div>
        );
      },
    },
    {
      title: "Cost Per Square Meter (vnđ)",
      dataIndex: "costPerSquareMeter",
      key: "costPerSquareMeter",
      align: "center",
      sorter: (a, b) => {
        const id1 =
          typeof a.id === "string" ? a.id : a.productDetailDTO.productId;
        const index1 = a.index;
        const id2 =
          typeof b.id === "string" ? b.id : b.productDetailDTO.productId;
        const index2 = b.index;

        return (
          parseFloat(
            form.getFieldValue([`${id1}_${index1}`, "costPerSquareMeter"])
          ) <
          parseFloat(
            form.getFieldValue([`${id2}_${index2}`, "costPerSquareMeter"])
          )
        );
      },
      sortDirections: ["descend", "ascend"],
      render: (_, record) => {
        const id =
          typeof record.id === "string"
            ? record.id
            : record.productDetailDTO?.productId ??
              record.productDetailDTO[0].productId;
        const index = record.index;

        return (
          <Form.Item
            name={[`${id}_${index}`, "costPerSquareMeter"]}
            rules={[
              {
                required: true,
                message: "Missing Cost Per Square Meter",
              },
            ]}
            onChange={(value) => onHandleChangeCost(record, value)}
            initialValue={1000}
            style={{
              minWidth: 170,
            }}
          >
            {isEditing(record) ? (
              <InputNumber
                min={1}
                onStep={(value) => onHandleChangeCost(record, value)}
                style={{
                  minWidth: 120,
                  width: 120,
                }}
              />
            ) : (
              <Input
                type="text"
                disabled
                placeholder="Shipment"
                style={{
                  color: "black",

                  minWidth: 120,
                  width: 120,
                }}
              />
            )}
          </Form.Item>
        );
      },
    },
    {
      title: "Quantity Box",
      dataIndex: "totalQuantityBox",
      key: "totalQuantityBox",
      align: "center",
      sorter: (a, b) => {
        const id1 =
          typeof a.id === "string" ? a.id : a.productDetailDTO.productId;
        const index1 = a.index;
        const id2 =
          typeof b.id === "string" ? b.id : b.productDetailDTO.productId;
        const index2 = b.index;

        return (
          parseFloat(
            form.getFieldValue([`${id1}_${index1}`, "totalQuantityBox"])
          ) <
          parseFloat(
            form.getFieldValue([`${id2}_${index2}`, "totalQuantityBox"])
          )
        );
      },
      sortDirections: ["descend", "ascend"],
      render: (_, record) => (
        <Form.Item
          name={[
            `${
              record.productDetailDTO?.productId ??
              record.productDetailDTO[0].productId
            }_${record.index}`,
            "totalQuantityBox",
          ]}
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
      sorter: (a, b) => {
        const id1 =
          typeof a.id === "string" ? a.id : a.productDetailDTO.productId;
        const index1 = a.index;
        const id2 =
          typeof b.id === "string" ? b.id : b.productDetailDTO.productId;
        const index2 = b.index;
        return (
          parseFloat(
            form.getFieldValue([`${id1}_${index1}`, "totalSquareMeter"])
          ) <
          parseFloat(
            form.getFieldValue([`${id2}_${index2}`, "totalSquareMeter"])
          )
        );
      },
      sortDirections: ["descend", "ascend"],
      render: (_, record) => (
        <Form.Item
          name={[
            `${
              record.productDetailDTO?.productId ??
              record.productDetailDTO[0].productId
            }_${record.index}`,
            "totalSquareMeter",
          ]}
          initialValue={0}
          style={{ padding: "0 1.5rem" }}
        >
          <Statistic precision={2} />
        </Form.Item>
      ),
    },
    {
      title: "Cost (vnđ)",
      dataIndex: "totalCost",
      key: "totalCost",
      align: "center",
      editable: true,
      sorter: (a, b) => {
        const id1 =
          typeof a.id === "string" ? a.id : a.productDetailDTO.productId;
        const index1 = a.index;
        const id2 =
          typeof b.id === "string" ? b.id : b.productDetailDTO.productId;
        const index2 = b.index;
        return (
          parseFloat(form.getFieldValue([`${id1}_${index1}`, "totalCost"])) <
          parseFloat(form.getFieldValue([`${id2}_${index2}`, "totalCost"]))
        );
      },
      sortDirections: ["descend", "ascend"],
      render: (_, record) => (
        <Form.Item
          name={[
            `${
              record.productDetailDTO?.productId ??
              record.productDetailDTO[0].productId
            }_${record.index}`,
            "totalCost",
          ]}
          initialValue={0}
          style={{ padding: "0 1.5rem" }}
        >
          <Statistic style={{ minWidth: "150px" }} precision={2} />
        </Form.Item>
      ),
    },
    {
      title: "Product Note",
      dataIndex: "noteImport",
      key: "noteImport",
      align: "center",
      editable: false,
      render: (_, record) => (
        <Form.Item
          name={[
            `${
              record.productDetailDTO?.productId ??
              record.productDetailDTO[0].productId
            }_${record.index}`,
            "noteImport",
          ]}
        >
          <Input.TextArea
            showCount
            maxLength={300}
            placeholder="Product note"
            disabled={!isEditing(record)}
            style={{
              height: "100%",
              resize: "none",
              minWidth: "200px",
              color: "black",
            }}
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
            <Menu>
              <Menu.Item>
                <NewProductDetailsModal record={record} />
              </Menu.Item>
              {typeof record.id === "number" && (
                <Menu.Item
                  onClick={() => onRowEdit(record)}
                  disabled={isEditing(record)}
                >
                  Edit Product
                </Menu.Item>
              )}
              <Menu.Item onClick={() => onRowDelete("deleteProduct", record)}>
                Remove Product
              </Menu.Item>
            </Menu>
          }
        >
          <a>
            More <DownOutlined />
          </a>
        </Dropdown>
      ),
    },
  ];

  useEffect(() => {
    productsImport.map((product) => {
      if (typeof product.id === "number") {
        const index = product.index;
        const id = product.productDetailDTO.productId;

        for (const key in product) {
          if (Object.hasOwnProperty.call(product, key)) {
            if (key.includes("WarehouseDTO")) {
              form.setFieldValue(
                [`${id}_${index}`, "warehouse"],
                product.importProductDetailWarehouseDTOList
              );
            } else if (key.includes("DetailDTO")) {
              let productDetailDTO = product.productDetailDTO;
              if (productDetailDTO.length) {
                productDetailDTO = editingValue;
              }

              for (const key in productDetailDTO) {
                if (key.includes("type")) {
                  form.setFieldValue(
                    [`${id}_${index}`, key],
                    `${productDetailDTO["id"]}_${productDetailDTO[key]}`
                  );
                } else if (!key.includes("costPerSquareMeter")) {
                  form.setFieldValue(
                    [`${id}_${index}`, key],
                    productDetailDTO[key]
                  );
                }
              }
            } else {
              form.setFieldValue([`${id}_${index}`, key], product[key]);
            }
          }
        }
      }
    });
  }, [dispatch, productsImport]);

  return (
    <Table
      size="middle"
      className={
        openHeader ? "listProductImport tranform" : "listProductImport"
      }
      columns={productColumns}
      dataSource={[...productsImport]}
      rowKey={(record) => {
        const id =
          typeof record.id === "string"
            ? record.id
            : record.productDetailDTO?.productId ??
              record.productDetailDTO[0].productId;
        const index = record.index;
        return `${id}_${index}`;
      }}
      loading={isLoading}
      scroll={{ x: "maxContent" }}
      expandable={{
        expandedRowRender: (record) => {
          const id =
            typeof record.id === "string"
              ? record.id
              : record.productDetailDTO?.productId ??
                record.productDetailDTO[0].productId;
          const index = record.index;
          let isDelete = false;

          return (
            <Form.List name={[`${id}_${index}`, "warehouse"]}>
              {(fields, { add, remove }) => {
                return (
                  <>
                    <div className="space-container">
                      {fields.map(({ key, name, ...restField }) => {
                        return (
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
                                      `${id}_${index}`,
                                      "warehouse",
                                    ]).filter(
                                      (item) => item.warehouseId === value
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
                                disabled={!isEditing(record)}
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
                              initialValue={1}
                            >
                              <InputNumber
                                min={1}
                                max={10000}
                                onStep={() => onHandleChangeQuantity(record)}
                                disabled={!isEditing(record)}
                              />
                            </Form.Item>

                            {isEditing(record) && fields.length > 1 && (
                              <MinusCircleOutlined
                                onClick={() => {
                                  onHanldeDeleteWarehouse(name, record, remove);
                                }}
                                style={{
                                  fontSize: "25px",
                                  transition: "all 0.3s ease",
                                }}
                              />
                            )}
                          </Space>
                        );
                      })}
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
                          !isEditing(record) ||
                          fields.length === listWarehouses.length
                        }
                      >
                        Add new select Warehouse
                      </Button>
                    </Form.Item>
                  </>
                );
              }}
            </Form.List>
          );
        },
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
      title={() => <SearchProduct />}
    />
  );
}
