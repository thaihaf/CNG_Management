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
  Select,
  Space,
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

import {
  updateListProductLv2,
  updateProductExport,
} from "features/export-product/exportProduct";
import "./TableCreate.css";
import SearchProduct from "../SearchProduct/SearchProduct";
import { CODE_ERROR } from "constants/errors.constants";
import { MESSAGE_ERROR } from "constants/messages.constants";
import { getMessage } from "helpers/util.helper";

const { Option } = Select;
const { Text, Title } = Typography;

export default function TableCreate({ form, updateMode, openHeader }) {
  const { listWarehouses } = useSelector((state) => state.warehouse);
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

  const onHandlePagination = (page, size) => {
    setCurrentPage(page);
    setPageSize(size);
  };
  const onRowDelete = (type, record) => {
    Modal.confirm({
      title: `Xác nhận xoá ${type}`,
      icon: <ExclamationCircleOutlined />,
      content: `Bạn có chắc chắn muốn xoá ${type} không?`,
      okText: "Xoá bỏ",
      cancelText: "Huỷ bỏ",
      onOk: () => {
        switch (type) {
          case "deleteProduct":
            const newListProduct = productsExport.filter(
              (p) => p.index !== record.index && p.index !== record.index
            );
            dispatch(updateProductExport(newListProduct));
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
              [`${record.id}_${record.index}`, "pricePerSquareMeter"],
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
    let totalQuantityExport = 0;
    let totalSquareMeterExport = 0;
    let totalExportOrderPrice = 0;

    productsExport.map((p) => {
      totalQuantityExport += form.getFieldValue([
        `${p.id}_${p.index}`,
        "totalQuantityBox",
      ]);
      totalSquareMeterExport += form.getFieldValue([
        `${p.id}_${p.index}`,
        "totalSquareMeter",
      ]);
      totalExportOrderPrice += form.getFieldValue([
        `${p.id}_${p.index}`,
        "totalCost",
      ]);
    });

    form.setFieldValue("totalQuantityExport", totalQuantityExport);
    form.setFieldValue("totalSquareMeterExport", totalSquareMeterExport);
    form.setFieldValue("totalExportOrderPrice", totalExportOrderPrice);
  };
  const onHandleChangeQuantity = (record) => {
    const totalQuantityBox = form
      .getFieldValue([`${record.id}_${record.index}`, "warehouse"])
      .reduce(function (result, warehouse) {
        let q = warehouse === undefined ? 1 : warehouse?.quantityBox;
        return result + q;
      }, 0);

    const pricePerSquareMeter = form.getFieldValue([
      `${record.id}_${record.index}`,
      "pricePerSquareMeter",
    ]);

    const totalSquareMeter = totalQuantityBox * record.squareMeterPerBox;
    const totalCost = totalSquareMeter * pricePerSquareMeter;

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
      const pricePerSquareMeter =
        typeof value === "number" ? value : Number(value.target.value);

      form.setFieldValue(
        [`${record.id}_${record.index}`, "totalCost"],
        record.squareMeterPerBox * totalQuantityBox * pricePerSquareMeter
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
      title: "STT",
      dataIndex: "index",
      key: "index",
      align: "center",
      sorter: (a, b) => a.index > b.index,
      sortDirections: ["descend", "ascend"],
      ...getColumnSearchProps("index"),
      render: (_, record) => record.index,
    },
    {
      title: "Sản phẩm",
      dataIndex: "id",
      key: "id",
      align: "center",
      sorter: (a, b) => a.id > b.id,
      sortDirections: ["descend", "ascend"],
      ...getColumnSearchProps("id"),
      render: (_, record) => {
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
                {record.id}
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
                message: "Lô hàng bị thiếu",
              },
            ]}
            style={{
              minWidth: 150,
            }}
          >
            <Select
              placeholder="Số lô"
              onChange={(value) => {
                let productDetailsFilter = record.productDetailDTO?.filter(
                  (item) => item.shipment === value
                );

                let ab = productsExport.map((product) => {
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

                form.setFieldValue([
                  `${record.id}_${record.index}`,
                  "warehouse",
                ]);
                form.setFieldValue([`${record.id}_${record.index}`, "type"]);
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
                minWidth: 100,
                width: "100%",
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

          <Form.Item
            name={[`${record.id}_${record.index}`, "type"]}
            rules={[
              {
                required: true,
                message: "Loại sản phẩm bị thiếu",
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
                      productIdTemp === record.id &&
                      p.index !== record.index &&
                      getFieldValue([`${productIdTemp}_${p.index}`, "type"]) ===
                        value
                    );
                  });

                  if (!value || a.length === 0) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Loại sản phẩm bị lặp lại!"));
                },
              }),
            ]}
            style={{
              minWidth: 100,
              width: "100%",
            }}
          >
            <Select
              placeholder="Loại sản phẩm"
              notFoundContent={null}
              onChange={() => {
                form.setFieldValue([
                  `${record.id}_${record.index}`,
                  "warehouse",
                ]);
              }}
            >
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
        </div>
      ),
    },
    {
      title: "Giá xuất/m2 (vnđ)",
      dataIndex: "pricePerSquareMeter",
      key: "pricePerSquareMeter",
      align: "center",
      sorter: (a, b) =>
        parseFloat(
          form.getFieldValue([`${a.id}_${a.index}`, "pricePerSquareMeter"])
        ) <
        parseFloat(
          form.getFieldValue([`${b.id}_${b.index}`, "pricePerSquareMeter"])
        ),
      sortDirections: ["descend", "ascend"],
      render: (_, record) => (
        <Form.Item
          name={[`${record.id}_${record.index}`, "pricePerSquareMeter"]}
          rules={[
            {
              required: true,
              message: "Giá mỗi mét vuông bị thiếu",
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
          <InputNumber
            min={1}
            onStep={(value) => onHandleChangeCost(record, value)}
            style={{
              minWidth: 150,
              width: 150,
            }}
          />
        </Form.Item>
      ),
    },
    {
      title: "Số hộp",
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
      title: "Mét vuông (m2)",
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
          <Statistic precision={2} />
        </Form.Item>
      ),
    },
    {
      title: "Thành tiền (vnđ)",
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
          style={{ padding: "0 0.5rem", minWidth: "100px" }}
        >
          <Statistic style={{ minWidth: "150px" }} precision={0} />
        </Form.Item>
      ),
    },
    {
      title: "Ghi chú",
      dataIndex: "noteExport",
      key: "noteExport",
      align: "center",
      render: (_, record) => (
        <Form.Item name={[`${record.id}_${record.index}`, "noteExport"]}>
          <Input.TextArea
            showCount
            maxLength={300}
            style={{ height: "100%", resize: "none", minWidth: "200px" }}
            placeholder="Ghi chú"
          />
        </Form.Item>
      ),
    },
    {
      title: "Hành động",
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
                  key: 2,
                  label: "Xoá sản phẩm",
                  onClick: () => onRowDelete("deleteProduct", record),
                },
              ]}
            />
          }
        >
          <a>
            Xem thêm <DownOutlined />
          </a>
        </Dropdown>
      ),
    },
  ];

  return (
    <Table
      size="middle"
      className="listProductImport"
      columns={productColumns}
      dataSource={productExportDetails ? null : [...productsExport]}
      rowKey={(record) => `${record.id}-${record.index}`}
      loading={isLoading}
      scroll={{ x: "maxContent" }}
      rowClassName={(record, index) =>
        index % 2 === 0 ? "table-row table-row-even" : "table-row table-row-odd"
      }
      expandable={{
        expandedRowRender: (record) => (
          <>
            <Form.List name={[`${record.id}_${record.index}`, "warehouse"]}>
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
                            label="Kho hàng"
                            name={[name, "productWarehouseId"]}
                            rules={[
                              {
                                required: true,
                                message: "Kho hàng bị thiếu",
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
                                    new Error("Kho hàng đã được chọn")
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
                            label="Số lượng"
                            name={[name, "quantityBox"]}
                            rules={[
                              {
                                required: true,
                                message: "Số lượng bị thiếu",
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
                                      new Error("Vui lòng chọn Kho hàng trước")
                                    );
                                  }

                                  let type = form.getFieldValue("type");

                                  console.log(type);
                                  if (
                                    type &&
                                    type === "EXPORT" &&
                                    value > warehouse?.quantityBox
                                  ) {
                                    return Promise.reject(
                                      new Error(
                                        `Số lượng tối đa của kho là ${warehouse?.quantityBox}`
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
                        Chọn thêm Kho hàng
                      </Button>
                    </Form.Item>
                  </>
                );
              }}
            </Form.List>
          </>
        ),
        expandIcon: ({ expanded, onExpand, record }) => (
          <Tooltip placement="topRight" title={"Hiển thị tất cả kho hàng"}>
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
      title={() => <SearchProduct />}
    />
  );
}
