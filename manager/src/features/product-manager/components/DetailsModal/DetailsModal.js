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
import {
  createDetailsProduct,
  updateDetailsProduct,
} from "features/product-manager/productManager";
import { getMessage } from "helpers/util.helper";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./DetailsModal.css";

import editImg from "assets/icons/edit.png";
import newFileImg from "assets/icons/newFile.png";

const { Text } = Typography;

export default function DetailsModal({ record, type }) {
  const [newProductDetailsForm] = Form.useForm();
  const { productsImport } = useSelector((state) => state.productImport);

  const dispatch = useDispatch();

  const [modal1Open, setModal1Open] = useState(false);
  const [isLoadingModal, setIsLoadingModal] = useState(false);

  const handleEdit = (record) => {
    console.log(record);
  };

  const hanleSubmit = (value) => {
    setIsLoadingModal(true);

    dispatch(
      type === "create"
        ? createDetailsProduct(value)
        : updateDetailsProduct({ id: record.id, data: value })
    )
      .then(unwrapResult)
      .then((res) => {
        setIsLoadingModal(false);
        setModal1Open(false);

        newProductDetailsForm.resetFields();

        notification.success({
          message: "Lô hàng và loại sản phẩm",
          description: `${
            type !== "create" ? "Cập nhật" : "Tạo mới"
          } Lô hàng và loại sản phẩm thành công!`,
        });
      })
      .catch((error) => {
        setIsLoadingModal(false);
        message.error(error.message);
        notification.error({
          message: "Lô hàng và loại sản phẩm",
          description: error.message,
        });
      });
  };

  const initialValues =
    type === "create"
      ? {
          productId: record?.id,
        }
      : { ...record };
  return (
    <>
      {type === "create" ? (
        <Button
          type="primary"
          shape="round"
          size={"large"}
          style={{
            width: "fitContent",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            paddingTop: "2.1rem",
            paddingBottom: "2.1rem",
            paddingLeft: "2.8rem",
            paddingRight: "2.8rem",
          }}
          onClick={() => {
            setModal1Open(true);
          }}
        >
          <img
            src={newFileImg}
            alt=""
            style={{ height: "2.2rem", width: "2.2rem" }}
          />
          Tạo mới
        </Button>
      ) : (
        <img
          src={editImg}
          alt=""
          style={{ width: "3rem", height: "3rem", cursor: "pointer" }}
          onClick={() => {
            setModal1Open(true);
          }}
        />
      )}

      <Modal
        title="Tạo mới Lô hàng và loại sản phẩm"
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
            name="newProductDetailsForm"
            id="newProductDetailsForm"
            colon={false}
            onFinish={hanleSubmit}
            initialValues={initialValues}
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
            {type === "edit" && (
              <div className="details__group">
                <Form.Item
                  name="costPerSquareMeter"
                  label={<Text>Chi phí trên mỗi mét vuông</Text>}
                  className="details__item"
                >
                  <Input
                    type="text"
                    className="login_input pass"
                    disabled={true}
                  />
                </Form.Item>
              </div>
            )}
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
                  className="details__item"
                  placeholder="Nhập số lô"
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
            {type === "edit" && (
              <div className="details__group">
                <Form.Item
                  name="status"
                  label={<Text>Trạng thái</Text>}
                  className="details__item"
                  rules={[
                    {
                      required: true,
                      message: getMessage(
                        CODE_ERROR.ERROR_REQUIRED,
                        MESSAGE_ERROR,
                        "Trạng thái"
                      ),
                    },
                  ]}
                >
                  <Select
                    placeholder="select Trạng thái"
                    style={{
                      width: 200,
                    }}
                    options={[
                      { key: "active", value: 1, label: "Hoạt động" },
                      { key: "inActive", value: 0, label: "Không hoạt động" },
                    ]}
                  />
                </Form.Item>
              </div>
            )}
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
