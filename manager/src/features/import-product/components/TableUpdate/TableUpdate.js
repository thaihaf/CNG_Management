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
  Dropdown,
  Form,
  Input,
  InputNumber,
  Menu,
  Modal,
  notification,
  Select,
  Space,
  Statistic,
  Table,
  Tooltip,
  Typography,
} from "antd";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { get } from "lodash";
import Highlighter from "react-highlight-words";
import avt_default from "assets/images/avt-default.png";
import {
  updateListProductLv2,
  updateProductImport,
  deleteProductImportDetail,
  deleteProductImportDetailWarehouse,
} from "features/import-product/importProduct";
import "./TableUpdate.css";
import { unwrapResult } from "@reduxjs/toolkit";
import NewProductDetailsModal from "../NewProductDetailsModal/NewProductDetailsModal";
import { getDetailsProduct } from "features/product-manager/productManager";
import SearchProduct from "../SearchProduct/SearchProduct";
import { getMessage } from "helpers/util.helper";
import { CODE_ERROR } from "constants/errors.constants";
import { MESSAGE_ERROR } from "constants/messages.constants";

const { Option } = Select;

export default function TableUpdate({ form, updateMode, openHeader }) {
  const { listWarehouses } = useSelector((state) => state.warehouse);
  const { productsImport, listProductLv2, productImportDetails } = useSelector(
    (state) => state.productImport
  );

  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

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
      title: `Xác nhận xoá`,
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn xoá không?`,
      okText: "Xoá bỏ",
      cancelText: "Huỷ bỏ",
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
                  notification.success({
                    message: `Xoá ${type}`,
                    description: `Xoá ${type} nhập thành công`,
                  });
                  setIsLoading(false);
                  onHandleCaculatorTotal(newListProduct);
                })
                .catch((err) => {
                  setIsLoading(false);
                  console.log(err);
                  notification.error({
                    message: `Xoá ${type}`,
                    description: `Xoá ${type} nhập thất bại`,
                  });
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
        title: "Xoá Kho hàng",
        icon: <ExclamationCircleOutlined />,
        content: "Bạn có chắc chắn muốn xoá Kho hàng không?",
        okText: "Xoá bỏ",
        cancelText: "Huỷ bỏ",
        onOk: () => {
          setIsLoading(true);
          dispatch(deleteProductImportDetailWarehouse(warehouseDelete.id))
            .then((res) => {
              notification.success({
                message: "Xoá Kho hàng",
                description: "Xoá Kho hàng thành công!",
              });
              callback(name);
              onHandleChangeQuantity(record);
              setIsLoading(false);
            })
            .catch((err) => {
              console.log(err);
              setIsLoading(false);
              notification.error({
                message: "Xoá Kho hàng",
                description: "Xoá Kho hàng thành công!",
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
            });

            firstLoop = false;
          }
        });
      }

      callback(name);
      onHandleChangeQuantity(record);
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
      title: "Sản phẩm",
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
      title: "Chi tiết sản phẩm",
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
                  message: "Số lô bị thiếu",
                },
              ]}
              style={{
                minWidth: 150,
              }}
            >
              {record.productDetailDTO?.length && isEditing(record) ? (
                <Select
                  placeholder="Số lô"
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
                  placeholder="Số lô"
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
                  essage: "Loại sản phẩm bị thiếu",
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
                      new Error("Loại sản phẩm bị lặp lại!")
                    );
                  },
                }),
              ]}
              style={{
                minWidth: 100,
                width: "100%",
              }}
            >
              {record.productDetailDTO ? (
                <Select
                  placeholder="Loại sản phẩm"
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
                  placeholder="Loại"
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
      title: "Giá nhập/m2 (VND)",
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
              {
                pattern: /^[0-9]/,
                message: getMessage(
                  CODE_ERROR.ERROR_FORMAT,
                  MESSAGE_ERROR,
                  "Giá phải là số dương"
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
      title: "Số hộp",
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
              typeof record.id === "string"
                ? record.id
                : record.productDetailDTO?.productId ??
                  record.productDetailDTO[0].productId
            }_${record.index}`,
            "totalQuantityBox",
          ]}
          initialValue={0}
          style={{ padding: "0 0.5rem", minWidth: "100px" }}
        >
          <Statistic />
        </Form.Item>
      ),
    },
    {
      title: "Mét vuông (m2)",
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
              typeof record.id === "string"
                ? record.id
                : record.productDetailDTO?.productId ??
                  record.productDetailDTO[0].productId
            }_${record.index}`,
            "totalSquareMeter",
          ]}
          initialValue={0}
          style={{ padding: "0 0.5rem", minWidth: "100px" }}
        >
          <Statistic precision={2} />
        </Form.Item>
      ),
    },
    {
      title: "Thành tiền (VND)",
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
      render: (_, record) => {
        const id =
          typeof record.id === "string"
            ? record.id
            : record.productDetailDTO?.productId ??
              record.productDetailDTO[0].productId;
        const index = record.index;
        return (
          <Form.Item
            name={[`${id}_${index}`, "totalCost"]}
            initialValue={0}
            style={{ padding: "0 0.5rem", minWidth: "100px" }}
          >
            <Statistic precision={0} />
          </Form.Item>
        );
      },
    },
    {
      title: "Ghi chú",
      dataIndex: "noteImport",
      key: "noteImport",
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
          <Form.Item name={[`${id}_${index}`, "noteImport"]}>
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
      title: "Hành động",
      dataIndex: "operation",
      key: "operation",
      align: "center",
      render: (_, record) => {
        let isCreate =
          !record.productDetailDTO || record.productDetailDTO?.length;

        return (
          productImportDetails?.status !== 2 && (
            <Dropdown
              overlay={
                <Menu>
                  {typeof record.id === "number" && (
                    <Menu.Item
                      onClick={() => onRowEdit(record)}
                      disabled={isEditing(record)}
                    >
                      Chỉnh sửa sản phẩm
                    </Menu.Item>
                  )}
                  {isCreate && (
                    <Menu.Item>
                      <NewProductDetailsModal record={record} />
                    </Menu.Item>
                  )}

                  <Menu.Item
                    onClick={() => onRowDelete("deleteProduct", record)}
                  >
                    Xoá sản phẩm
                  </Menu.Item>
                </Menu>
              }
            >
              <a>
                Xem thêm <DownOutlined />
              </a>
            </Dropdown>
          )
        );
      },
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
      className={
        openHeader ? "listProductImport tranform" : "listProductImport"
      }
      rowClassName={(record, index) =>
        index % 2 === 0 ? "table-row table-row-even" : "table-row table-row-odd"
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
                              label="Kho hàng"
                              name={[name, "warehouseId"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Kho hàng bị thiếu",
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
                                      new Error("Kho hàng đã được chọn!")
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
                              label="Số lượng"
                              name={[name, "quantityBox"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Số lượng bị thiếu",
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

                    {productImportDetails?.status !== 2 && (
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
                          Thêm mới Kho hàng
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
          <Tooltip placement="topRight" title={"Hiển thị Kho hàng"}>
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
              pageSizeOptions: ["10", "15", "20"],
            }
          : false
      }
      title={() =>
        productImportDetails?.status !== 2 && (
          <SearchProduct updateMode={updateMode} form={form} />
        )
      }
    />
  );
}
