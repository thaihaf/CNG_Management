import {
  CaretDownFilled,
  CaretUpFilled,
  DownOutlined,
  ExclamationCircleOutlined,
  MinusCircleOutlined,
  PlusOutlined,
  SearchOutlined,
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
  notification,
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
import dayjs from "dayjs";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { get } from "lodash";
import Highlighter from "react-highlight-words";
import avt_default from "assets/images/avt-default.png";

import "./TableUpdate.css";
import { unwrapResult } from "@reduxjs/toolkit";
import { getDetailsProduct } from "features/product-manager/productManager";
import {
  deleteProductExportDetail,
  deleteProductExportDetailWarehouse,
  updateListProductLv2,
  updateProductExport,
} from "features/export-product/exportProduct";
import SearchProduct from "../SearchProduct/SearchProduct";
import { CODE_ERROR } from "constants/errors.constants";
import { getMessage } from "helpers/util.helper";
import { MESSAGE_ERROR } from "constants/messages.constants";

const { Option } = Select;
const { Text, Title } = Typography;

export default function TableUpdate({ form, updateMode }) {
  const { productsExport, listProductLv2, productExportDetails } = useSelector(
    (state) => state.productExport
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
    let totalQuantityExport = 0;
    let totalSquareMeterExport = 0;
    let totalExportOrderPrice = 0;

    let initialList = productsExport;
    if (newList) {
      initialList = newList;
    }

    initialList.map((p) => {
      const id =
        typeof p.id === "string"
          ? p.id
          : p.productDetailDTO?.productId ?? p.productDetailDTO[0].productId;
      const index = p.index;

      totalQuantityExport += form.getFieldValue([
        `${id}_${index}`,
        "quantityBox",
      ]);
      totalSquareMeterExport += form.getFieldValue([
        `${id}_${index}`,
        "totalSquareMeter",
      ]);
      totalExportOrderPrice += form.getFieldValue([
        `${id}_${index}`,
        "totalPrice",
      ]);
    });

    form.setFieldValue("totalQuantityExport", totalQuantityExport);
    form.setFieldValue("totalSquareMeterExport", totalSquareMeterExport);
    form.setFieldValue("totalExportOrderPrice", totalExportOrderPrice);
  };
  const onHandleChangeQuantity = (record) => {
    const id =
      typeof record.id === "string"
        ? record.id
        : record.productDetailDTO?.productId ??
          record.productDetailDTO[0].productId;
    const index = record.index;

    const quantityBox = form
      .getFieldValue([`${id}_${index}`, "warehouse"])
      .reduce(function (result, warehouse) {
        let q = warehouse === undefined ? 1 : warehouse?.quantityBox;
        return result + q;
      }, 0);
    const pricePerSquareMeter = form.getFieldValue([
      `${id}_${index}`,
      "pricePerSquareMeter",
    ]);

    const totalSquareMeter = quantityBox * record.squareMeterPerBox;
    const totalPrice = totalSquareMeter * pricePerSquareMeter;

    form.setFieldValue([`${id}_${index}`, "quantityBox"], quantityBox);
    form.setFieldValue(
      [`${id}_${index}`, "totalSquareMeter"],
      totalSquareMeter
    );
    form.setFieldValue([`${id}_${index}`, "totalPrice"], totalPrice);
    onHandleCaculatorTotal();
  };
  const onHandleChangeCost = (record, value) => {
    const id =
      typeof record.id === "string"
        ? record.id
        : record.productDetailDTO?.productId ??
          record.productDetailDTO[0].productId;
    const index = record.index;

    const quantityBox = form.getFieldValue([`${id}_${index}`, "quantityBox"]);

    if (quantityBox) {
      const pricePerSquareMeter =
        typeof value === "number" ? value : Number(value.target.value);

      form.setFieldValue(
        [`${id}_${index}`, "totalPrice"],
        record.squareMeterPerBox * quantityBox * pricePerSquareMeter
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
      title: `X??c nh???n xo?? S???n ph???m`,
      icon: <ExclamationCircleOutlined />,
      content: `B???n c?? ch???c ch???n mu???n xo?? S???n ph???m kh??ng?`,
      okText: "Xo?? b???",
      cancelText: "Hu??? b???",
      onOk: () => {
        if (typeof record.id === "number") {
          setIsLoading(true);
          dispatch(deleteProductExportDetail(record.id))
            .then(unwrapResult)
            .then((res) => {
              //v1
              const newListProduct = productsExport.filter(
                (p) => p.index !== record.index
              );
              const newListProduct1 = newListProduct.map((item, index) => {
                return { ...item, index: index + 1 };
              });

              //v2
              const newListProductv2 = listProductLv2.filter(
                (p) => p.index !== record.index
              );
              const newListProductv2_1 = newListProductv2.map((item, index) => {
                return { ...item, index: index + 1 };
              });
              dispatch(updateProductExport(newListProduct1));
              dispatch(updateListProductLv2(newListProductv2_1));
              notification.success({
                message: "Xo?? S???n ph???m",
                description: "Xo?? S???n ph???m nh???p th??nh c??ng",
              });
              setIsLoading(false);
              onHandleCaculatorTotal(newListProduct);
            })
            .catch((err) => {
              setIsLoading(false);
              console.log(err);
              notification.error({
                message: "Xo?? S???n ph???m",
                description: "Xo?? S???n ph???m nh???p th???t b???i",
              });
            });
        } else {
          const newListProduct = productsExport.filter(
            (p) => p.index !== record.index
          );
          const newListProduct1 = newListProduct.map((item, index) => {
            return { ...item, index: index + 1 };
          });
          dispatch(updateProductExport(newListProduct1));
          onHandleCaculatorTotal(newListProduct);
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
          let ab = productsExport.map((product) => {
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
          let abc = productsExport.map((product) => {
            if (product.index === record.index) {
              return {
                ...record,
                productDetailDTO: productDetailsFilter,
              };
            } else {
              return product;
            }
          });

          dispatch(updateProductExport(ab));
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

    const warehouseDelete = form.getFieldValue([
      `${id}_${index}`,
      "warehouse",
      name,
    ]);
    const warehouseList = form.getFieldValue([`${id}_${index}`, "warehouse"]);
    const warehouseInDB = form
      .getFieldValue([`${id}_${index}`, "warehouse"])
      .filter((item) => item?.id);

    if (warehouseDelete.id && warehouseInDB.length > 1) {
      Modal.confirm({
        title: "Xo?? Kho h??ng",
        icon: <ExclamationCircleOutlined />,
        content: "B???n c?? ch???c ch???n mu???n xo?? Kho h??ng kh??ng?",
        okText: "Xo?? b???",
        cancelText: "Hu??? b???",
        onOk: () => {
          setIsLoading(true);
          dispatch(deleteProductExportDetailWarehouse(warehouseDelete.id))
            .then((res) => {
              notification.success({
                message: "Xo?? Kho h??ng",
                description: "Xo?? Kho h??ng th??nh c??ng!",
              });
              callback(name);
              onHandleChangeQuantity(record);
              setIsLoading(false);
            })
            .catch((err) => {
              console.log(err);
              setIsLoading(false);
              notification.error({
                message: "Xo?? Kho h??ng",
                description: "Xo?? Kho h??ng th??nh c??ng!",
              });
            });
        },
        onCancel: () => {},
      });
    } else {
      let firstLoop = true;

      if (warehouseDelete.id) {
        warehouseList.map((w, index2) => {
          if (!w?.id && firstLoop) {
            form.setFieldValue([`${id}_${index}`, "warehouse", index2], {
              ...w,
              id: warehouseDelete.id,
              exportProductDetailId: warehouseDelete.exportProductDetailId,
            });

            firstLoop = false;
          }
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
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: "center",
      sorter: (a, b) => a.index > b.index,
      sortDirections: ["descend", "ascend"],
      ...getColumnSearchProps("index", "index"),
      render: (_, record) => record.index,
    },
    {
      title: "S???n ph???m",
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
        const index = record.index;

        return (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "1.5rem",
              padding: "0 0.5rem",
            }}
          >
            <Avatar
              size={50}
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
                  fontSize: "14px",
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
      title: "Chi ti???t s???n ph???m",
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
              padding: "0 0.5rem",
            }}
          >
            <Form.Item
              name={[`${id}_${index}`, "shipment"]}
              rules={[
                {
                  required: true,
                  message: "S??? l?? b??? thi???u",
                },
              ]}
              style={{
                minWidth: 150,
              }}
            >
              {record.productDetailDTO?.length && isEditing(record) ? (
                <Select
                  placeholder="S??? l??"
                  onChange={(value) => {
                    let productDetailsFilter = record.productDetailDTO?.filter(
                      (item) => item.shipment === value
                    );
                    let ab = productsExport.map((product) => {
                      if (product.index === record.index) {
                        return {
                          ...record,
                          productDetailDTO: productDetailsFilter,
                        };
                      } else {
                        return product;
                      }
                    });

                    form.setFieldValue([`${id}_${index}`, "warehouse"]);
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
                  placeholder="S??? l??"
                  style={{
                    color: "black",
                  }}
                />
              )}
            </Form.Item>

            <Form.Item
              name={[`${id}_${index}`, "type"]}
              style={{
                minWidth: 100,
                width: "100%",
              }}
              rules={[
                {
                  required: true,
                  message: "Lo???i s???n ph???m b??? thi???u",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    let a = productsExport.filter((p) => {
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
                      new Error("Lo???i s???n ph???m b??? l???p l???i!")
                    );
                  },
                }),
              ]}
            >
              {record.productDetailDTO ? (
                <Select
                  placeholder="Lo???i s???n ph???m"
                  notFoundContent={null}
                  onChange={(value, option) => {
                    form.setFieldValue([
                      `${record.id}_${record.index}`,
                      "warehouse",
                    ]);

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
                                  disabled={item.status === 0 ? true : false}
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
              ) : (
                <Input
                  type="text"
                  disabled
                  placeholder="Lo???i"
                  style={{
                    color: "black",
                  }}
                />
              )}
            </Form.Item>
          </div>
        );
      },
    },
    {
      title: "Gi?? xu???t/m2 (VND)",
      dataIndex: "pricePerSquareMeter",
      key: "pricePerSquareMeter",
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
            form.getFieldValue([`${id1}_${index1}`, "pricePerSquareMeter"])
          ) <
          parseFloat(
            form.getFieldValue([`${id2}_${index2}`, "pricePerSquareMeter"])
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
            name={[`${id}_${index}`, "pricePerSquareMeter"]}
            rules={[
              {
                required: true,
                message: "Gi?? tr??n m???i m??t vu??ng b??? thi???u",
              },
              {
                pattern: /^[0-9]/,
                message: getMessage(
                  CODE_ERROR.ERROR_FORMAT,
                  MESSAGE_ERROR,
                  "Gi?? ph???i l?? s??? d????ng"
                ),
              },
            ]}
            onChange={(value) => onHandleChangeCost(record, value)}
            initialValue={1000}
            style={{ padding: "0 0.5rem", minWidth: "100px" }}
          >
            {isEditing(record) ? (
              <InputNumber
                min={1}
                onStep={(value) => onHandleChangeCost(record, value)}
                style={{
                  minWidth: 150,
                  width: 150,
                }}
              />
            ) : (
              <Input
                type="text"
                disabled
                style={{
                  color: "black",
                  minWidth: 150,
                  width: 150,
                }}
              />
            )}
          </Form.Item>
        );
      },
    },
    {
      title: "S??? h???p",
      dataIndex: "quantityBox",
      key: "quantityBox",
      align: "center",
      sorter: (a, b) => {
        const id1 =
          typeof a.id === "string" ? a.id : a.productDetailDTO.productId;
        const index1 = a.index;
        const id2 =
          typeof b.id === "string" ? b.id : b.productDetailDTO.productId;
        const index2 = b.index;

        return (
          parseFloat(form.getFieldValue([`${id1}_${index1}`, "quantityBox"])) <
          parseFloat(form.getFieldValue([`${id2}_${index2}`, "quantityBox"]))
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
            name={[`${id}_${index}`, "quantityBox"]}
            initialValue={0}
            style={{ padding: "0 0.5rem", minWidth: "100px" }}
          >
            <Statistic />
          </Form.Item>
        );
      },
    },
    {
      title: "M??t vu??ng (m2)",
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
      render: (_, record) => {
        const id =
          typeof record.id === "string"
            ? record.id
            : record.productDetailDTO?.productId ??
              record.productDetailDTO[0].productId;
        const index = record.index;

        return (
          <Form.Item
            name={[`${id}_${index}`, "totalSquareMeter"]}
            initialValue={0}
            style={{ padding: "0 0.5rem", minWidth: "100px" }}
          >
            <Statistic precision={2} />
          </Form.Item>
        );
      },
    },
    {
      title: "Th??nh ti???n (VND)",
      dataIndex: "totalPrice",
      key: "totalPrice",
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
          parseFloat(form.getFieldValue([`${id1}_${index1}`, "totalPrice"])) <
          parseFloat(form.getFieldValue([`${id2}_${index2}`, "totalPrice"]))
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
            name={[`${id}_${index}`, "totalPrice"]}
            initialValue={0}
            style={{ padding: "0 0.5rem", minWidth: "100px" }}
          >
            <Statistic style={{ minWidth: "150px" }} precision={0} />
          </Form.Item>
        );
      },
    },
    {
      title: "Ghi ch??",
      dataIndex: "noteExport",
      key: "noteExport",
      align: "center",
      editable: false,
      render: (_, record) => {
        const id =
          typeof record.id === "string"
            ? record.id
            : record.productDetailDTO?.productId ??
              record.productDetailDTO[0].productId;
        const index = record.index;

        return (
          <Form.Item name={[`${id}_${index}`, "noteExport"]}>
            <Input.TextArea
              showCount
              maxLength={300}
              disabled={!isEditing(record)}
              style={{
                height: "100%",
                resize: "none",
                minWidth: "200px",
                color: "black",
              }}
            />
          </Form.Item>
        );
      },
    },
    {
      title: "H??nh ?????ng",
      dataIndex: "operation",
      key: "operation",
      align: "center",
      width: 120,
      render: (_, record) => (
        <Dropdown
          overlay={
            <Menu>
              {typeof record.id === "number" && (
                <Menu.Item
                  onClick={() => onRowEdit(record)}
                  disabled={
                    isEditing(record) || productExportDetails?.status === 4
                  }
                >
                  Ch???nh s???a s???n ph???m
                </Menu.Item>
              )}
              <Menu.Item
                onClick={() => onRowDelete("deleteProduct", record)}
                disabled={
                  productsExport.length <= 1 ||
                  productExportDetails?.status === 4
                }
              >
                Xo?? s???n ph???m
              </Menu.Item>
            </Menu>
          }
        >
          <a>
            Xem th??m <DownOutlined />
          </a>
        </Dropdown>
      ),
    },
  ];

  useEffect(() => {
    productsExport.map((product) => {
      if (typeof product.id === "number") {
        const index = product.index;
        const id = product.productDetailDTO.productId;

        for (const key in product) {
          if (Object.hasOwnProperty.call(product, key)) {
            if (key === "exportProductDetailWarehouseList") {
              form.setFieldValue(
                [`${id}_${index}`, "warehouse"],
                product.exportProductDetailWarehouseList
              );
            } else if (key == "productDetailDTO") {
              let productDetailDTO = product.productDetailDTO;
              if (productDetailDTO.length) {
                productDetailDTO = editingValue;
              }

              for (const key in productDetailDTO) {
                if (key === "type") {
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
  }, [dispatch, productsExport]);

  return (
    <Table
      size="middle"
      className="listProductImport"
      rowClassName={(record, index) =>
        index % 2 === 0 ? "table-row table-row-even" : "table-row table-row-odd"
      }
      columns={productColumns}
      dataSource={[...productsExport]}
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

          return (
            <Form.List name={[`${id}_${index}`, "warehouse"]}>
              {(fields, { add, remove }) => {
                let detailID = form
                  .getFieldValue([`${id}_${index}`, "type"])
                  ?.split("_")[0];

                let productDetailDTO = record.productDetailDTO.length
                  ? record.productDetailDTO.find(
                      (item) => item.id.toString() === detailID
                    )
                  : record.productDetailDTO;

                let maxLength =
                  productDetailDTO?.productWarehouseDTOList?.filter(
                    (item) => item.quantityBox > 0
                  )?.length;

                let addWarehouse =
                  productExportDetails?.status !== 2 ||
                  productExportDetails?.status !== 4;

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
                              label="Kho h??ng"
                              name={[name, "productWarehouseId"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Kho h??ng b??? thi???u!",
                                },
                                ({ getFieldValue }) => ({
                                  validator(_, value) {
                                    let checkExist = getFieldValue([
                                      `${id}_${index}`,
                                      "warehouse",
                                    ]).filter(
                                      (item) =>
                                        item.productWarehouseId === value
                                    );

                                    if (!value || checkExist.length === 1) {
                                      return Promise.resolve();
                                    }
                                    return Promise.reject(
                                      new Error("Kho h??ng ???? ???????c ch???n!")
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
                              label="S??? l?????ng"
                              name={[name, "quantityBox"]}
                              rules={[
                                {
                                  required: true,
                                  message: "S??? l?????ng b??? thi???u!",
                                },
                                ({ getFieldValue }) => ({
                                  validator(_, value) {
                                    let wId = form.getFieldValue([
                                      `${id}_${index}`,
                                      "warehouse",
                                      name,
                                    ])?.productWarehouseId;

                                    let warehouse =
                                      productDetailDTO?.productWarehouseDTOList?.find(
                                        (item) => item.id === wId
                                      );

                                    if (!wId) {
                                      return Promise.reject(
                                        new Error("Vui l??ng ch???n Kho tr?????c")
                                      );
                                    }

                                    let oldWarehouse =
                                      record.exportProductDetailWarehouseList[
                                        name
                                      ]?.quantityBox || 0;

                                    if (
                                      value >
                                      warehouse?.quantityBox + oldWarehouse
                                    ) {
                                      return Promise.reject(
                                        new Error(
                                          `S??? l?????ng t???i ??a l?? ${
                                            warehouse?.quantityBox +
                                            oldWarehouse
                                          }`
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

                    {addWarehouse && (
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
                            !detailID ||
                            !maxLength ||
                            fields.length === maxLength
                          }
                        >
                          Th??m m???i Kho xu???t
                        </Button>
                      </Form.Item>
                    )}
                  </>
                );
              }}
            </Form.List>
          );
        },
        expandIcon: ({ expanded, onExpand, record }) => (
          <Tooltip placement="topRight" title={"Hi???n th??? Kho h??ng"}>
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
        productsExport.length !== 0
          ? {
              showSizeChanger: true,
              position: ["bottomCenter"],
              size: "default",
              pageSize: pageSize,
              current: currentPage,
              total: productsExport.length,
              onChange: (page, size) => onHandlePagination(page, size),
              pageSizeOptions: ["2", "5", "10"],
            }
          : false
      }
      title={() => productExportDetails?.status !== 4 && <SearchProduct />}
    />
  );
}
