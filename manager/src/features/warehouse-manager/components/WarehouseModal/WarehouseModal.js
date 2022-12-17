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

import "./WarehouseModal.css";

import { useLocation } from "react-router-dom";
import { getDistrict, getProvince } from "features/provinces/provinces";
import {
  createDetails,
  getWarehouses,
  updateDetails,
} from "features/warehouse-manager/warehouseManager";

const { Text } = Typography;
const { TextArea } = Input;

export default function WarehouseModal({ data }) {
  const { provinces, districts, wards } = useSelector(
    (state) => state.provinces
  );

  const dispatch = useDispatch();
  const location = useLocation();
  const [form] = Form.useForm();

  const [modal1Open, setModal1Open] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onFinish = async ({ addressDTO, noteWarehouse, status, ...args }) => {
    const dataRender = {
      addressDTO: {
        city:
          typeof addressDTO.city === "string"
            ? addressDTO.city
            : addressDTO.city.value,
        district:
          typeof addressDTO.district === "string"
            ? addressDTO.district
            : addressDTO.district.value,
        ward:
          typeof addressDTO.ward === "string"
            ? addressDTO.ward
            : addressDTO.ward.value,
        apartmentNumber: addressDTO.apartmentNumber,
      },
      ...args,
      status: data ? status : 1,
      noteWarehouse: noteWarehouse ? noteWarehouse : "",
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
            message: "Cập nhật Kho hàng",
            description: "Cập nhật Kho hàng thành công",
          });
        } else {
          const query = queryString.parse(location.search);
          if (query.number) {
            query.number = query.number - 1;
          }
          dispatch(getWarehouses({ ...query, sort: "createAt,desc" }))
            .then(unwrapResult)
            .then(() => {
              setIsLoading(false);
              setModal1Open(false);
              notification.success({
                message: "Tạo mới Kho hàng",
                description: "Tạo mới Kho hàng thành công",
              });
            })
            .catch(() => {
              setIsLoading(false);
              notification.error({
                message: "Tải danh sách Kho hàng",
                description: "Tải danh sách Kho hàng thất bại",
              });
            });
        }
      })
      .catch((error) => {
        setIsLoading(false);
        notification.error({
          message: data ? "Cập nhật Kho hàng" : "Tạo mới Kho hàng",
          description: data
            ? "Cập nhật Kho hàng thất bại"
            : "Tạo mới Kho hàng thất bại",
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
          Tạo Kho
        </Button>
      )}

      <Modal
        title={data ? "Chỉnh sửa Kho hàng" : "Tạo mới Kho hàng"}
        style={{ top: 50 }}
        open={modal1Open}
        onOk={() => setModal1Open(false)}
        onCancel={() => setModal1Open(false)}
        footer={false}
        className="warehouseModal"
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
                name="warehouseName"
                label={<Text>Tên kho</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "Tên kho"
                    ),
                  },
                  {
                    pattern:
                      /^[a-zA-Z0-9aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆ fFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTu UùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ\s]{2,50}$/,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_LETTER,
                      MESSAGE_ERROR,
                      "Tên kho"
                    ),
                  },
                  {
                    max: 50,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MAX,
                      MESSAGE_ERROR,
                      "Tên kho",
                      50
                    ),
                  },
                  {
                    min: 2,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MIN,
                      MESSAGE_ERROR,
                      "Tên kho",
                      2
                    ),
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="phoneNumber"
                label={<Text>Số điện thoại</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "Số điện thoại"
                    ),
                  },
                  {
                    pattern: /^[0]{1}[0-9]{9,10}$/,
                    message: getMessage(
                      CODE_ERROR.ERROR_FORMAT_NUMBER,
                      MESSAGE_ERROR,
                      "Số điện thoại"
                    ),
                  },
                  {
                    max: 11,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MAX,
                      MESSAGE_ERROR,
                      "Số điện thoại",
                      11
                    ),
                  },
                  {
                    min: 9,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MIN,
                      MESSAGE_ERROR,
                      "Số điện thoại",
                      9
                    ),
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </div>

            <div className="details__group">
              <Form.Item
                name={["addressDTO", "apartmentNumber"]}
                label={<Text>Tên đường, số nhà</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "Tên đường, Số nhà"
                    ),
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={["addressDTO", "city"]}
                label="Tỉnh, Thành phố"
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "Tỉnh, Thành phố"
                    ),
                  },
                ]}
              >
                <Select
                  labelInValue
                  showSearch
                  style={{
                    width: 200,
                  }}
                  onChange={(value) => {
                    dispatch(getProvince(value.key));
                    form.setFieldValue(["addressDTO", "district"]);
                    form.setFieldValue(["addressDTO", "ward"]);
                  }}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.includes(input)
                  }
                  filterSort={(optionA, optionB) =>
                    optionA.children
                      .toLowerCase()
                      .localeCompare(optionB.children.toLowerCase())
                  }
                >
                  {provinces?.map((p) => {
                    return (
                      <Select.Option value={p.name} key={p.code}>
                        {`${p.name}`}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </div>
            <div className="details__group">
              <Form.Item
                name={["addressDTO", "district"]}
                label={<Text>Quận, Huyện</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "Quận, Huyện"
                    ),
                  },
                ]}
              >
                <Select
                  labelInValue
                  showSearch
                  style={{
                    width: 200,
                  }}
                  onChange={(value, e) => {
                    dispatch(getDistrict(value.key));
                    form.setFieldValue(["addressDTO", "ward"]);
                  }}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.includes(input)
                  }
                  filterSort={(optionA, optionB) =>
                    optionA.children
                      .toLowerCase()
                      .localeCompare(optionB.children.toLowerCase())
                  }
                >
                  {districts?.map((d) => {
                    return (
                      <Select.Option value={d.name} key={d.code}>
                        {`${d.name}`}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>

              <Form.Item
                name={["addressDTO", "ward"]}
                label={<Text>Xã, Phường</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "Xã, Phường"
                    ),
                  },
                ]}
              >
                <Select
                  labelInValue
                  showSearch
                  style={{
                    width: 200,
                  }}
                  onChange={(value, e) => {
                    console.log(value.value);
                    // dispatch(
                    // 		 getDistrict(value.key)
                    // );
                  }}
                  optionFilterProp="children"
                  filterOption={(input, option) =>
                    option.children.includes(input)
                  }
                  filterSort={(optionA, optionB) =>
                    optionA.children
                      .toLowerCase()
                      .localeCompare(optionB.children.toLowerCase())
                  }
                >
                  {wards?.map((w) => {
                    return (
                      <Select.Option value={w.name} key={w.code}>
                        {`${w.name}`}
                      </Select.Option>
                    );
                  })}
                </Select>
              </Form.Item>
            </div>

            <div className="details__group align-start">
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
                name="noteWarehouse"
                label={<Text>Ghi chú</Text>}
                className={data ? "details__item" : "details__item w-full"}
              >
                <TextArea showCount maxLength={1000} style={{ height: 100 }} />
              </Form.Item>
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
