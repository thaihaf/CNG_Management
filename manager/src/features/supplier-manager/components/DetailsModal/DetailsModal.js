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
import moment from "moment";
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
  createDeptSupplier,
  updateDebtSuppliers,
  updateDeptSupplier,
} from "features/supplier-manager/supplierManager";

const { Text } = Typography;
const { TextArea } = Input;

export default function DetailsModal({ record, updateMode }) {
  const [debtSupplierForm] = Form.useForm();

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
        ? updateDeptSupplier({ id: record.id, data: formatedValue })
        : createDeptSupplier(formatedValue)
    )
      .then(unwrapResult)
      .then((res) => {
        setIsLoadingModal(false);
        setModal1Open(false);
        debtSupplierForm.resetFields();

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
    : { supplierId: record?.id };

  return (
    <>
      {updateMode ? (
        <img
          src={editImg}
          alt=""
          style={{ width: "3rem", height: "3rem", cursor: "pointer" }}
          onClick={() => {
            setModal1Open(true);
          }}
        />
      ) : (
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
          Tạo mới Công nợ
        </Button>
      )}

      <Modal
        title={`${updateMode ? "Cập nhật" : "Tạo mới"} Công nợ`}
        style={{ top: 20 }}
        open={modal1Open}
        onOk={() => setModal1Open(false)}
        onCancel={() => setModal1Open(false)}
        footer={[]}
        className="modalSetting"
      >
        <Spin spinning={isLoadingModal}>
          <Form
            form={debtSupplierForm}
            layout="horizontal"
            name="debtSupplierForm"
            id="debtSupplierForm"
            colon={false}
            onFinish={hanleSubmit}
            initialValues={initialValues}
          >
            <div className="details__group">
              <Form.Item
                name="supplierId"
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
                <Input
                  type="text"
                  className="login_input pass"
                  disabled={true}
                />
              </Form.Item>
            </div>
            <div className="details__group">
              <Form.Item
                name="paymentAmount"
                label={<Text>Số tiền thanh toán</Text>}
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
                initialValue={1}
              >
                <InputNumber min={1} max={10000} className="details__item" />
              </Form.Item>
            </div>
            <div className="details__group">
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
                  placeholder="Chọn loại thanh toán"
                  style={{
                    width: 200,
                  }}
                  options={[
                    {
                      key: "Chuyển khoản",
                      value: "Chuyển khoản",
                      label: "Chuyển khoản",
                    },
                    { key: "Tiền mặt", value: "Tiền mặt", label: "Tiền mặt" },
                  ]}
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
                  updateMode ? moment(record?.debtDay, "DD/MM/YYYY") : moment()
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
                  debtSupplierForm.resetFields();
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
