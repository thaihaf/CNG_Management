import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Divider,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Table,
} from "antd";
import React, { useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import avt_default from "assets/images/avt-default.png";
import {
  updateListProductLv2,
  updateListProductLv3,
} from "features/import-product/importProduct";
import "./ListProductImport.css";
const { Option } = Select;
let index = 0;

export default function ListProductImport({ form }) {
  const { listWarehouses } = useSelector((state) => state.warehouse);
  const { productsImport, listProductLv2, listProductLv3 } = useSelector(
    (state) => state.importProduct
  );

  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  const productColumns = [
    {
      title: "Image",
      dataIndex: "image",
      key: "image",
      align: "center",
      render: (_, record) => (
        <Avatar
          size={50}
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
    },
    {
      title: "Shipment",
      dataIndex: "shipment",
      key: "shipment",
      render: (_, record) => (
        <Form.Item
          name={`${record.id}_shipment`}
          rules={[
            {
              required: true,
              message: "Missing shipment",
            },
          ]}
        >
          <Select
            placeholder="enter shipment"
            onChange={(value) => {
              let productDetailsFilter = record.productDetailDTO.filter(
                (item) => item.shipment === value
              );

              let ab = listProductLv2.map((product) => {
                if (product.id === record.id) {
                  return { ...record, productDetailDTO: productDetailsFilter };
                } else {
                  return product;
                }
              });

              console.log(ab);
              dispatch(updateListProductLv2(ab));
            }}
            style={{
              width: 200,
            }}
          >
            {record.productDetailDTO &&
              record.productDetailDTO.map((item, index, arr) => {
                if (index === 0) {
                  return (
                    <Option value={item.shipment} key={item.id}>
                      {item.shipment}
                    </Option>
                  );
                } else if (item.shipment !== arr[index - 1].shipment) {
                  return (
                    <Option value={item.shipment} key={item.id}>
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
      render: (_, record) => (
        <Form.Item
          name={`${record.id}_type`}
          rules={[
            {
              required: true,
              message: "Missing Type",
            },
          ]}
        >
          <Select
            placeholder="enter type"
            onChange={(value) => {
              let product = listProductLv2.find(
                (item) => item.id === record.id
              );
              console.log(product);
              let productDetailsFilter = product.productDetailDTO.filter(
                (item) => item.type === value
              );

              let ab = listProductLv2.map((p) => {
                form.setFieldValue(
                  `id_${p.id}`,
                  productDetailsFilter[0].productWarehouseDTOList
                );

                if (p.id === record.id) {
                  return { ...record, productDetailDTO: productDetailsFilter };
                } else {
                  return p;
                }
              });

              console.log(ab);
              dispatch(updateListProductLv3(ab));
            }}
            style={{
              width: 200,
            }}
          >
            {listProductLv2?.map((product) => {
              if (product.id === record.id) {
                return product.productDetailDTO.map((item, index, arr) => {
                  if (index === 0) {
                    return (
                      <Option value={item.type} key={item.id}>
                        {item.type}
                      </Option>
                    );
                  } else if (item.type !== arr[index - 1].type) {
                    return (
                      <Option value={item.type} key={item.id}>
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
      render: (_, record) => (
        <Form.Item
          name={`${record.id}_color`}
          rules={[
            {
              required: true,
              message: "Missing Color",
            },
          ]}
        >
          <Select
            placeholder="enter color"
            onChange={(value) => {
              let product = listProductLv3.find(
                (item) => item.id === record.id
              );
              console.log(product);
              let productDetailsFilter = product.productDetailDTO.filter(
                (item) => item.color === value
              );

              let ab = listProductLv2.map((p) => {
                if (p.id === record.id) {
                  return { ...record, productDetailDTO: productDetailsFilter };
                } else {
                  return p;
                }
              });

              console.log(ab);
              // setListProductLv3(ab);
            }}
            style={{
              width: 200,
            }}
          >
            {listProductLv3?.map((product) => {
              if (product.id === record.id) {
                return product.productDetailDTO.map((item, index, arr) => {
                  if (index === 0) {
                    return (
                      <Option value={item.color} key={item.id}>
                        {item.color}
                      </Option>
                    );
                  } else if (item.color !== arr[index - 1].color) {
                    return (
                      <Option value={item.color} key={item.id}>
                        {item.color}
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
      title: "Cost per box",
      dataIndex: "costPerBox",
      key: "costPerBox",
      render: (_, record) => (
        <Form.Item
          name={`${record.id}_costPerBox`}
          rules={[
            {
              required: true,
              message: "Missing Cost per box",
            },
          ]}
        >
          <InputNumber min={1} max={10} />
        </Form.Item>
      ),
    },
  ];

  return (
    <Table
      columns={productColumns}
      expandable={{
        expandedRowRender: (record) => (
          <>
            <Form.List name={`id_${record.id}`}>
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
                          name={[name, "wareHouseName"]}
                          rules={[
                            {
                              required: true,
                              message: "Missing sight",
                            },
                          ]}
                        >
                          <Select
                            // disabled={!form.getFieldValue("area")}
                            style={{
                              width: 130,
                            }}
                          >
                            {listWarehouses.map((item) => {
                              let a = form
                                .getFieldValue(`id_${record.id}`)
                                .find(
                                  (i) =>
                                    i !== undefined &&
                                    i?.wareHouseName == item.warehouseName
                                );
                              if (!a) {
                                return (
                                  <Option
                                    key={item.id}
                                    value={item.warehouseName}
                                  >
                                    {item.warehouseName}
                                  </Option>
                                );
                              }
                            })}
                          </Select>
                        </Form.Item>

                        <Form.Item
                          {...restField}
                          label="Quantity"
                          name={[name, "quantityBox"]}
                          rules={[
                            {
                              required: true,
                              message: "Missing last name",
                            },
                          ]}
                        >
                          <InputNumber min={1} max={10} />
                        </Form.Item>
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </Space>
                    ))}
                  </div>

                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add field
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </>
        ),
        defaultExpandedRowKeys: ["0"],
      }}
      dataSource={[...productsImport]}
      size="middle"
    />
  );
}
