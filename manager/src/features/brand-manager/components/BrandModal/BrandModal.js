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
import { useDispatch, useSelector } from "react-redux";
import editImg from "assets/icons/edit.png";
import queryString from "query-string";

import "./BrandModal.css";

import { useLocation } from "react-router-dom";
import { getDistrict, getProvince } from "features/provinces/provinces";
import {
  createDetails,
  getBrands,
  updateDetails,
} from "features/brand-manager/brandManager";

const { Text } = Typography;
const { TextArea } = Input;

export default function BrandModal({ data }) {
  const { listActiveSuppliers } = useSelector((state) => state.supplier);

  const dispatch = useDispatch();
  const location = useLocation();
  const [form] = Form.useForm();

  const [modal1Open, setModal1Open] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onFinish = async ({ status, ...args }) => {
    const dataRender = {
      ...args,
      status: data ? status : 1,
    };

    setIsLoading(true);
    dispatch(
      data
        ? updateDetails({ id: data.id, dataRender: dataRender })
        : createDetails(dataRender)
    )
      .then(unwrapResult)
      .then((res) => {
        if (data) {
          setIsLoading(false);
          setModal1Open(false);
          notification.success({
            message: "Cập nhật Nhãn hàng",
            description: "Cập nhật Nhãn hàng thành công",
          });
        } else {
          const query = queryString.parse(location.search);
          if (query.number) {
            query.number = query.number - 1;
          }
          dispatch(getBrands({ ...query, sort: "createAt,desc" }))
            .then(unwrapResult)
            .then(() => {
              setIsLoading(false);
              setModal1Open(false);
              notification.success({
                message: "Tạo mới Nhãn hàng",
                description: "Tạo mới Nhãn hàng thành công",
              });
            })
            .catch(() => {
              setIsLoading(false);
              notification.error({
                message: "Tải danh sách Nhãn hàng",
                description: "Tải danh sách Nhãn hàng thất bại",
              });
            });
        }
      })
      .catch((error) => {
        setIsLoading(false);
        notification.error({
          message: data ? "Cập nhật Nhãn hàng" : "Tạo mới Nhãn hàng",
          description: data
            ? "Cập nhật Nhãn hàng thất bại"
            : "Tạo mới Nhãn hàng thất bại",
        });
      });
  };

  const initialValues = data ? data : null;

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
          Tạo Nhãn hàng
        </Button>
      )}

      <Modal
        title={data ? "Chỉnh sửa Nhãn hàng" : "Tạo mới Nhãn hàng"}
        style={{ top: 50 }}
        open={modal1Open}
        onOk={() => setModal1Open(false)}
        onCancel={() => setModal1Open(false)}
        footer={false}
        className="brandModal"
      >
        <Spin spinning={isLoading}>
          <Form
            form={form}
            colon={false}
            onFinish={onFinish}
            initialValues={initialValues}
          >
            <div className="details__group">
              <Form.Item
                name="supplierId"
                label={<Text>Tên Nhà cung cấp</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED_SELECT,
                      MESSAGE_ERROR,
                      "Tên Nhà cung cấp"
                    ),
                  },
                ]}
              >
                <Select
                  showSearch
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.toLowerCase().includes(input.toLowerCase())
                  }
                >
                  {listActiveSuppliers.map((s) => (
                    <Select.Option value={s.id} key={s.id} id={s.id}>
                      {s.supplierName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>

              <Form.Item
                name="brandName"
                label={<Text>Tên Nhãn Hàng</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "Tên Nhãn Hàng"
                    ),
                  },
                  {
                    pattern:
                      /^[a-zA-Z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]{2,25}$/,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_LETTER,
                      MESSAGE_ERROR,
                      "Tên Nhãn Hàng"
                    ),
                  },
                  {
                    max: 25,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MAX,
                      MESSAGE_ERROR,
                      "Tên Nhãn Hàng",
                      25
                    ),
                  },
                  {
                    min: 2,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MIN,
                      MESSAGE_ERROR,
                      "Tên Nhãn Hàng",
                      2
                    ),
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </div>
            <div className="details__group">
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
            </div>

            <div className="btns" style={{ marginTop: 30 }}>
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
