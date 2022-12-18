import { PlusCircleTwoTone } from "@ant-design/icons";
import { unwrapResult } from "@reduxjs/toolkit";
import {
  Button,
  DatePicker,
  Form,
  Input,
  InputNumber,
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
import dayjs from "dayjs";
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
import {
  createDeptCustomer,
  updateDeptCustomer,
} from "features/customer-manager/customerManager";

const { Text } = Typography;
const { TextArea } = Input;

export default function DetailsModal({ record, updateMode }) {
  const [debtCustomerForm] = Form.useForm();

  const dispatch = useDispatch();

  const [modal1Open, setModal1Open] = useState(false);
  const [isLoadingModal, setIsLoadingModal] = useState(false);

  const hanleSubmit = (value) => {
    setIsLoadingModal(true);

    const formatedValue = {
      ...value,
      note: value.note ? value.note : "",
      debtDay: value.debtDate.format("DD/MM/YYYY"),
    };

    dispatch(
      updateMode
        ? updateDeptCustomer({ id: record.id, data: formatedValue })
        : createDeptCustomer(formatedValue)
    )
      .then(unwrapResult)
      .then((res) => {
        setIsLoadingModal(false);
        setModal1Open(false);
        debtCustomerForm.resetFields();

        notification.success({
          message: "Công nợ",
          description: `${
            updateMode ? "Cập nhật" : "Tạo mới"
          } Công nợ thành công!`,
        });
      })
      .catch((error) => {
        setIsLoadingModal(false);
        notification.error({
          message: "Công nợ",
          description: `${
            updateMode ? "Cập nhật" : "Tạo mới"
          } Công nợ thất bại!`,
        });
      });
  };

  const initialValues = updateMode
    ? {
        ...record,
      }
    : { customerId: record?.id };

  return (
    <>
      {updateMode ? (
        <img
          src={editImg}
          alt=""
          style={{ width: "2.3rem", height: "2.3rem", cursor: "pointer" }}
          onClick={() => {
            setModal1Open(true);
          }}
        />
      ) : (
        <Button
          type="primary"
          shape="round"
          style={{
            width: "fitContent",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            padding: "2rem",
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
          Tạo mới Công nợ
        </Button>
      )}

      <Modal
        title={`${updateMode ? "Cập nhật" : "Tạo mới"} Công nợ`}
        style={{ top: 20 }}
        open={modal1Open}
        onOk={() => setModal1Open(false)}
        onCancel={() => setModal1Open(false)}
        footer={false}
        className="customerDebtModal"
      >
        <Spin spinning={isLoadingModal}>
          <Form
            form={debtCustomerForm}
            layout="horizontal"
            name="debtCustomerForm"
            id="debtCustomerForm"
            colon={false}
            onFinish={hanleSubmit}
            initialValues={initialValues}
          >
            <div className="details__group">
              <Form.Item
                name="customerId"
                label={<Text>Mã Khách hàng</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "Mã Khách hàng"
                    ),
                  },
                ]}
              >
                <Input type="text" disabled={true} />
              </Form.Item>
            </div>

            <div className="details__group">
              <Form.Item
                name="paymentAmount"
                label={<Text>Số tiền thanh toán (vnđ)</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "Số tiền thanh toán"
                    ),
                  },
                ]}
                initialValue={10000}
              >
                <InputNumber
                  min={1}
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                  parser={(value) => value.replace(/\$\s?|(,*)/g, "")}
                  className="details__item"
                />
              </Form.Item>
              <Form.Item
                name="paymentType"
                label={<Text>Loại Thanh toán</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "Loại Thanh toán"
                    ),
                  },
                ]}
              >
                <Select
                  options={[
                    {
                      key: "Chuyển khoản",
                      value: "Chuyển khoản",
                      label: "Chuyển khoản",
                    },
                    { key: "Tiền mặt", value: "Tiền mặt", label: "Tiền mặt" },
                  ]}
                />
              </Form.Item>
            </div>

            <div className="details__group">
              <Form.Item
                name="debtDate"
                label={<Text>Ngày tạo</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "Ngày tạo"
                    ),
                  },
                ]}
                initialValue={
                  updateMode ? dayjs(record?.debtDay, "DD/MM/YYYY") : dayjs()
                }
              >
                <DatePicker format="DD/MM/YYYY" />
              </Form.Item>
            </div>

            <div className="details__group">
              <Form.Item
                name="note"
                label={<Text>Ghi chú</Text>}
                className="details__item"
              >
                <TextArea
                  showCount
                  maxLength={300}
                  style={{
                    height: "100%",
                    resize: "none",
                    minWidth: "200px",
                  }}
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
                  debtCustomerForm.resetFields();
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
