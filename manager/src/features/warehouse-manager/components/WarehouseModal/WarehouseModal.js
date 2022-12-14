import React from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import queryString from "query-string";

import {
  Button,
  Form,
  Input,
  Modal,
  Select,
  Spin,
  Typography,
  notification,
} from "antd";

import { CODE_ERROR } from "constants/errors.constants";
import { MESSAGE_ERROR } from "constants/messages.constants";
import { getMessage } from "helpers/util.helper";

import { getDistrict, getProvince } from "features/provinces/provinces";
import {
  createDetails,
  getWarehouses,
  updateDetails,
} from "features/warehouse-manager/warehouseManager";

import editImg from "assets/icons/edit.png";
import "./WarehouseModal.css";

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
            message: "C???p nh???t Kho h??ng",
            description: "C???p nh???t Kho h??ng th??nh c??ng",
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
                message: "T???o m???i Kho h??ng",
                description: "T???o m???i Kho h??ng th??nh c??ng",
              });
            })
            .catch(() => {
              setIsLoading(false);
              notification.error({
                message: "T???i danh s??ch Kho h??ng",
                description: "T???i danh s??ch Kho h??ng th???t b???i",
              });
            });
        }
      })
      .catch((error) => {
        setIsLoading(false);
        notification.error({
          message: data ? "C???p nh???t Kho h??ng" : "T???o m???i Kho h??ng",
          description: data
            ? "C???p nh???t Kho h??ng th???t b???i"
            : "T???o m???i Kho h??ng th???t b???i",
        });
      });
  };

  const initialValues = data ? data : null;

  return (
    <>
      {data ? (
        <div
          style={{
            width: "4rem",
            height: "4rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            borderRadius: "50%",
            background: "#eaf0f6",
          }}
          onClick={() => setModal1Open(true)}
        >
          <img
            src={editImg}
            alt="Edit"
            style={{ width: "2.2rem", height: "2.2rem", margin: "auto" }}
          />
        </div>
      ) : (
        <Button
          type="primary"
          shape={"round"}
          onClick={() => setModal1Open(true)}
          style={{ width: "15rem", height: "3.8rem" }}
        >
          T???o Kho
        </Button>
      )}

      <Modal
        title={data ? "Ch???nh s???a Kho h??ng" : "T???o m???i Kho h??ng"}
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
                label={<Text>T??n kho</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "T??n kho"
                    ),
                  },
                  {
                    pattern:
                      /^[a-zA-Z0-9aA????????????????????????????????????????????????????????????????????????????????????????????bBcCdD????eE???????????????????????????????????????????????????????????? fFgGhHiI????????????????????????jJkKlLmMnNoO????????????????????????????????????????????????????????????????????????????????????????????pPqQrRsStTu U??????????????????????????????????????????????????????????vVwWxXyY????????????????????????????zZ\s]{2,50}$/,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_LETTER,
                      MESSAGE_ERROR,
                      "T??n kho"
                    ),
                  },
                  {
                    max: 50,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MAX,
                      MESSAGE_ERROR,
                      "T??n kho",
                      50
                    ),
                  },
                  {
                    min: 2,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MIN,
                      MESSAGE_ERROR,
                      "T??n kho",
                      2
                    ),
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="phoneNumber"
                label={<Text>S??? ??i???n tho???i</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "S??? ??i???n tho???i"
                    ),
                  },
                  {
                    pattern: /^[0]{1}[0-9]{9,10}$/,
                    message: getMessage(
                      CODE_ERROR.ERROR_FORMAT_NUMBER,
                      MESSAGE_ERROR,
                      "S??? ??i???n tho???i"
                    ),
                  },
                  {
                    max: 11,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MAX,
                      MESSAGE_ERROR,
                      "S??? ??i???n tho???i",
                      11
                    ),
                  },
                  {
                    min: 9,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MIN,
                      MESSAGE_ERROR,
                      "S??? ??i???n tho???i",
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
                label={<Text>T??n ???????ng, s??? nh??</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "T??n ???????ng, S??? nh??"
                    ),
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={["addressDTO", "city"]}
                label="T???nh, Th??nh ph???"
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "T???nh, Th??nh ph???"
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
                label={<Text>Qu???n, Huy???n</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "Qu???n, Huy???n"
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
                label={<Text>X??, Ph?????ng</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "X??, Ph?????ng"
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
                  label="Tr???ng th??i"
                  className="details__item"
                  rules={[
                    {
                      required: true,
                      message: getMessage(
                        CODE_ERROR.ERROR_REQUIRED,
                        MESSAGE_ERROR,
                        "Tr???ng th??i"
                      ),
                    },
                  ]}
                >
                  <Select
                    options={[
                      {
                        value: 1,
                        label: "HO???T ?????NG",
                      },
                      {
                        value: 0,
                        label: "KH??NG HO???T ?????NG",
                      },
                    ]}
                  />
                </Form.Item>
              )}

              <Form.Item
                name="noteWarehouse"
                label={<Text>Ghi ch??</Text>}
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
                Hu??? b???
              </Button>
              <Button
                shape="round"
                type="primary"
                htmlType="submit"
                style={{ width: "15rem", height: "3.8rem" }}
              >
                {data ? "C???p nh???t" : "T???o m???i"}
              </Button>
            </div>
          </Form>
        </Spin>
      </Modal>
    </>
  );
}
