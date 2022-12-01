import { PlusCircleTwoTone } from "@ant-design/icons";
import { unwrapResult } from "@reduxjs/toolkit";
import {
  Button,
  Form,
  Input,
  message,
  Modal,
  notification,
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
  const { productsImport } = useSelector((state) => state.productImport);

  const dispatch = useDispatch();

  const [modal1Open, setModal1Open] = useState(false);
  const [isLoadingModal, setIsLoadingModal] = useState(false);

  const hanleSubmit = (value) => {
    console.log(value);
    let checkExist = record.productDetailDTO?.find(
      (item) => item.shipment === value.shipment && item.type === value.type
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
            if (product.index === record.index) {
              return { ...record, productDetailDTO: newproductDetailDTO };
            } else {
              return product;
            }
          });
          dispatch(updateProductImport(ab));

          setIsLoadingModal(false);
          setModal1Open(false);
          newProductDetailsForm.resetFields();
          notification.success({
            message: "Số lô và loại sản phẩm",
            description: "Tạo mới Số lô và loại sản phẩm thành công!",
          });
        })
        .catch((error) => {
          setIsLoadingModal(false);
          notification.error({
            message: "Số lô và loại sản phẩm",
            description: "Tạo mới Số lô và loại sản phẩm thất bại!",
          });
        });
    } else {
      message.error("Số lô và loại sản phẩm đã tồn tại!");
    }
  };

  return (
    <>
      <Text onClick={() => setModal1Open(true)}>
        Tạo mới Số lô và loại sản phẩm
      </Text>

      <Modal
        title="Tạo mới Số lô và loại sản phẩm"
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
            initialValues={{
              productId:
                typeof record.id === "string"
                  ? record.id
                  : record.productDetailDTO?.productId ??
                    record.productDetailDTO[0].productId,
            }}
          >
            <div className="details__group">
              <Form.Item
                name="productId"
                label={<Text>Mã sản phẩm</Text>}
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
                label={<Text>Số lô</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "Số lô"
                    ),
                  },
                  {
                    max: 25,
                    message: getMessage(
                      CODE_ERROR.ERROR_MAX_LENGTH,
                      MESSAGE_ERROR,
                      "Số lô",
                      25
                    ),
                  },
                ]}
              >
                <Input
                  type="text"
                  className="login_input pass"
                  placeholder="nhập Số lô"
                />
              </Form.Item>
            </div>
            <div className="details__group">
              <Form.Item
                name="type"
                label={<Text>Loại sản phẩm</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "Loại sản phẩm"
                    ),
                  },
                ]}
              >
                <Select
                  placeholder="Chọn Loại sản phẩm"
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
                Huỷ bỏ
              </Button>
              <Button
                key="submit"
                shape={"round"}
                type="primary"
                htmlType="submit"
              >
                Gửi đi
              </Button>
            </div>
          </Form>
        </Spin>
      </Modal>
    </>
  );
}
