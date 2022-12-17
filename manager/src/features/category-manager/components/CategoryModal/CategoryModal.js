import { unwrapResult } from "@reduxjs/toolkit";
import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Spin,
  Switch,
  Typography,
  notification,
} from "antd";
import { CODE_ERROR } from "constants/errors.constants";
import { MESSAGE_ERROR } from "constants/messages.constants";
import { getMessage } from "helpers/util.helper";
import React from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import editImg from "assets/icons/edit.png";
import queryString from "query-string";

import "./CategoryModal.css";
import {
  createDetails,
  getCategories,
  updateDetails,
} from "features/category-manager/categoryManager";
import { useLocation } from "react-router-dom";

const { Text } = Typography;
const { TextArea } = Input;

export default function CategoryModal({ data }) {
  const dispatch = useDispatch();
  const location = useLocation();
  const [form] = Form.useForm();

  const [modal1Open, setModal1Open] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onFinish = async (values) => {
    setIsLoading(true);
    dispatch(
      data
        ? updateDetails({ id: data.id, data: values })
        : createDetails({
            data: {
              ...values,
              status: 1,
            },
          })
    )
      .then(unwrapResult)
      .then((res) => {
        if (data) {
          setIsLoading(false);
          setModal1Open(false);
          notification.success({
            message: "Cập nhật chức năng",
            description: "Cập nhật chức năng thành công",
          });
        } else {
          const query = queryString.parse(location.search);
          if (query.number) {
            query.number = query.number - 1;
          }
          dispatch(getCategories({ ...query, sort: "createAt,desc" }))
            .then(unwrapResult)
            .then(() => {
              setIsLoading(false);
              setModal1Open(false);
              notification.success({
                message: "Tạo mới chức năng",
                description: "Tạo mới chức năng thành công",
              });
            })
            .catch(() => {
              setIsLoading(false);
              notification.error({
                message: "Tải danh sách Chức năng",
                description: "Tải danh sách Chức năng thất bại",
              });
            });
        }
      })
      .catch((error) => {
        setIsLoading(false);
        notification.error({
          message: data ? "Cập nhật chức năng" : "Tạo mới chức năng",
          description: data
            ? "Cập nhật chức năng thất bại"
            : "Tạo mới chức năng thất bại",
        });
      });
  };

  return (
    <>
      {data ? (
        <div
          style={{
            width: "2.5rem",
            display: "flex",
            alignItems: "center",
            cursor: "pointer",
          }}
          onClick={() => setModal1Open(true)}
        >
          <img src={editImg} alt="Edit" />
        </div>
      ) : (
        <Button
          type="primary"
          shape={"round"}
          onClick={() => setModal1Open(true)}
          style={{ width: "15rem", height: "3.8rem" }}
        >
          Tạo Chức năng
        </Button>
      )}

      <Modal
        title={data ? "Chỉnh sửa Chức năng" : "Tạo mới Chức năng"}
        style={{ top: 50 }}
        open={modal1Open}
        onOk={() => setModal1Open(false)}
        onCancel={() => setModal1Open(false)}
        footer={false}
        className="categoryModal"
      >
        <Spin spinning={isLoading}>
          <Form
            form={form}
            colon={false}
            onFinish={onFinish}
            initialValues={data}
          >
            <div className="details__group">
              <Form.Item
                name="categoryName"
                label={<Text>Tên Chức năng</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "Tên Chức năng"
                    ),
                  },
                  {
                    pattern:
                      /^[a-zA-Z0-9aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆ fFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTu UùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ\s]{2,50}$/,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_LETTER,
                      MESSAGE_ERROR,
                      "Tên Chức năng"
                    ),
                  },
                  {
                    max: 50,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MAX,
                      MESSAGE_ERROR,
                      "Tên Chức năng",
                      50
                    ),
                  },
                  {
                    min: 2,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MIN,
                      MESSAGE_ERROR,
                      "Tên Chức năng",
                      2
                    ),
                  },
                ]}
              >
                <Input />
              </Form.Item>

              {data && (
                <Form.Item
                  name="status"
                  label="Trạng thái"
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
                    options={[
                      {
                        value: 1,
                        label: "HOẠT ĐỘNG",
                      },
                      {
                        value: 0,
                        label: "KHÔNG HOẠT ĐỘNG",
                      },
                    ]}
                  />
                </Form.Item>
              )}

              <Form.Item
                name="description"
                label={<Text>Mô tả</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "Mô tả"
                    ),
                  },
                ]}
                style={{ marginBottom: 30 }}
              >
                <TextArea showCount maxLength={1000} style={{ height: 120 }} />
              </Form.Item>
            </div>
            <div className="btns">
              <Button
                shape={"round"}
                htmlType="reset"
                onClick={() => {
                  setModal1Open(false);
                }}
                style={{ width: "12rem", height: "3.8rem" }}
              >
                Huỷ bỏ
              </Button>
              <Button
                shape="round"
                type="primary"
                htmlType="submit"
                style={{ width: "15rem", height: "3.8rem" }}
              >
                {data ? "Cập nhật" : "Tạo mới"}
              </Button>
            </div>
          </Form>
        </Spin>
      </Modal>
    </>
  );
}
