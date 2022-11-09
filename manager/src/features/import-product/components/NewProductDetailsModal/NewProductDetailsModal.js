import { PlusCircleTwoTone } from "@ant-design/icons";
import { unwrapResult } from "@reduxjs/toolkit";
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  Select,
  Spin,
  Tooltip,
  Typography,
} from "antd";
import { CODE_ERROR } from "constants/errors.constants";
import { MESSAGE_ERROR } from "constants/messages.constants";
import { typeDetails } from "features/import-product/constants/import-product.constants";
import {
  updateListProductLv2,
  updateProductImport,
} from "features/import-product/importProduct";
import { createDetailsProduct } from "features/product-manager/productManager";
import { getMessage } from "helpers/util.helper";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./NewProductDetailsModal.css";

const { Text } = Typography;

export default function NewProductDetailsModal({ record }) {
  const [newProductDetailsForm] = Form.useForm();
  const { productsImport } = useSelector((state) => state.importProduct);

  const dispatch = useDispatch();

  const [modal1Open, setModal1Open] = useState(false);
  const [isLoadingModal, setIsLoadingModal] = useState(false);

  const hanleSubmit = (value) => {
    console.log(value);
    let checkExist = record.productDetailDTO?.find(
      (item) =>
        item.shipment === value.shipment &&
        item.type === value.type &&
        item.color === value.color
    );

    if (!value || !checkExist) {
      setIsLoadingModal(true);

      dispatch(createDetailsProduct(value))
        .then(unwrapResult)
        .then((res) => {
          let newproductDetailDTO = record.productDetailDTO
            ? [...record.productDetailDTO, res]
            : [res];

          let ab = productsImport.map((product) => {
            if (product.id === record.id && product.index === record.index) {
              return { ...record, productDetailDTO: newproductDetailDTO };
            } else {
              return product;
            }
          });
          dispatch(updateProductImport(ab));

          setIsLoadingModal(false);
          setModal1Open(false);
          newProductDetailsForm.resetFields();
          message.success("Create New Product Details success!");
        })
        .catch((error) => {
          setIsLoadingModal(false);
          message.error(error.message);
        });
    } else {
      message.error("Product Details existed!");
    }
  };

  return (
    <>
      <Tooltip title="add new product details" color={"cyan"}>
        <PlusCircleTwoTone
          onClick={() => setModal1Open(true)}
          style={{ fontSize: "23px", cursor: "pointer" }}
        />
      </Tooltip>

      <Modal
        title="New Product Details"
        style={{ top: 20 }}
        open={modal1Open}
        onOk={() => setModal1Open(false)}
        onCancel={() => setModal1Open(false)}
        footer={[]}
        className="modalSetting"
      >
        <Spin spinning={isLoadingModal}>
          <Form
            form={newProductDetailsForm}
            layout="horizontal"
            name="newProductDetailsForm"
            id="newProductDetailsForm"
            colon={false}
            onFinish={hanleSubmit}
            initialValues={{ productId: record.id }}
          >
            <div className="details__group">
              <Form.Item
                name="productId"
                label={<Text>Product ID</Text>}
                className="details__item"
              >
                <Input
                  type="text"
                  className="login_input pass"
                  disabled={true}
                />
              </Form.Item>
            </div>
            <div className="details__group">
              <Form.Item
                name="shipment"
                label={<Text>Shipment</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "Shipment"
                    ),
                  },
                  {
                    max: 25,
                    message: getMessage(
                      CODE_ERROR.ERROR_MAX_LENGTH,
                      MESSAGE_ERROR,
                      "Shipment",
                      25
                    ),
                  },
                ]}
              >
                <Input
                  type="text"
                  className="login_input pass"
                  placeholder="enter shipment"
                />
              </Form.Item>
            </div>
            <div className="details__group">
              <Form.Item
                name="type"
                label={<Text>Type</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "Type"
                    ),
                  },
                ]}
              >
                <Select
                  placeholder="select type"
                  style={{
                    width: 200,
                  }}
                  options={typeDetails}
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    (option?.label ?? "").includes(input)
                  }
                  filterSort={(optionA, optionB) =>
                    (optionA?.label ?? "")
                      .toLowerCase()
                      .localeCompare((optionB?.label ?? "").toLowerCase())
                  }
                />
              </Form.Item>
            </div>
            <div className="details__group">
              <Form.Item
                name="color"
                label={<Text>Color</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "Color"
                    ),
                  },
                  {
                    max: 25,
                    message: getMessage(
                      CODE_ERROR.ERROR_MAX_LENGTH,
                      MESSAGE_ERROR,
                      "Color",
                      25
                    ),
                  },
                ]}
              >
                <Input
                  type="text"
                  className="login_input pass"
                  placeholder="enter color"
                />
              </Form.Item>
            </div>

            <div className="btns">
              <Button
                key="back"
                shape={"round"}
                htmlType="reset"
                onClick={() => {
                  setModal1Open(false);
                  newProductDetailsForm.resetFields();
                }}
              >
                Cancel
              </Button>
              <Button
                key="submit"
                shape={"round"}
                type="primary"
                htmlType="submit"
              >
                Submit
              </Button>
            </div>
          </Form>
        </Spin>
      </Modal>
    </>
  );
}
