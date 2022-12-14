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
  Upload,
  notification,
} from "antd";
import { CODE_ERROR } from "constants/errors.constants";
import { MESSAGE_ERROR } from "constants/messages.constants";
import { getMessage } from "helpers/util.helper";
import React from "react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import editImg from "assets/icons/edit.png";
import avt_default from "assets/images/avt-default.png";

import queryString from "query-string";
import { storage } from "firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";

import { useLocation } from "react-router-dom";
import { getDistrict, getProvince } from "features/provinces/provinces";

import { CameraOutlined } from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import {
  createDetails,
  getCustomers,
} from "features/customer-manager/customerManager";

import "./CustomerModal.css";

const { Text } = Typography;
const { TextArea } = Input;

export default function CustomerModal() {
  const { provinces, districts, wards } = useSelector(
    (state) => state.provinces
  );

  const dispatch = useDispatch();
  const location = useLocation();
  const [form] = Form.useForm();

  const [imgURL, setImgUrl] = useState(null);

  const [modal1Open, setModal1Open] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const upLoadImg = async (file) => {
    if (file == null) return;

    const imgRef = ref(storage, `images/${file.name + v4()}`);
    uploadBytes(imgRef, file).then((snapshot) => {
      getDownloadURL(snapshot.ref).then((url) => {
        setIsLoading(false);
        setImgUrl(url);
      });
    });
  };

  const onFinish = async ({ addressDTO, noteWarehouse, status, ...args }) => {
    const dataRender = {
      addressDTO: {
        city: addressDTO.city.value,
        district: addressDTO.district.value,
        ward: addressDTO.ward.value,
        apartmentNumber: addressDTO.apartmentNumber,
      },
      ...args,
      status: 1,
      fileAttachDTO: {
        filePath: imgURL === null ? "" : imgURL,
      },
    };
    setIsLoading(true);
    dispatch(createDetails(dataRender))
      .then(unwrapResult)
      .then((res) => {
        const query = queryString.parse(location.search);
        if (query.page) {
          query.page = query.page - 1;
        }
        dispatch(getCustomers({ ...query, sort: "createAt,desc" }))
          .then(unwrapResult)
          .then(() => {
            setIsLoading(false);
            setModal1Open(false);
            notification.success({
              message: "T???o m???i Kh??ch h??ng",
              description: "T???o m???i Kh??ch h??ng th??nh c??ng",
            });
          })
          .catch(() => {
            setIsLoading(false);
            notification.error({
              message: "T???i danh s??ch Kh??ch h??ng",
              description: "T???i danh s??ch Kh??ch h??ng th???t b???i",
            });
          });
      })
      .catch((error) => {
        setIsLoading(false);
        notification.error({
          message: "T???o m???i Kh??ch h??ng",
          description: "T???o m???i Kh??ch h??ng th???t b???i",
        });
      });
  };

  return (
    <>
      <Button
        type="primary"
        shape={"round"}
        onClick={() => setModal1Open(true)}
        style={{ width: "15rem", height: "3.8rem" }}
      >
        T???o Kh??ch h??ng
      </Button>

      <Modal
        title={"T???o m???i Kh??ch h??ng"}
        style={{ top: 50 }}
        open={modal1Open}
        onOk={() => setModal1Open(false)}
        onCancel={() => setModal1Open(false)}
        footer={false}
        width={700}
        className="customerModal"
      >
        <Spin spinning={isLoading}>
          <Form form={form} colon={false} onFinish={onFinish}>
            <div className="details__group">
              <div className="details__avatar">
                <div className="details__avatar-img">
                  <img
                    src={!imgURL || imgURL === "" ? avt_default : imgURL}
                    alt="avt"
                  />
                </div>
                <Form.Item
                  valuePropName="fileList"
                  className="item_choose-avt"
                  name="avt"
                >
                  <ImgCrop rotate>
                    <Upload
                      listType="picture-card"
                      maxCount={1}
                      beforeUpload={(file) => {
                        setIsLoading(true);
                        return new Promise((resolve) => {
                          const reader = new FileReader();
                          reader.onload = () => {
                            if (reader.readyState === 2) {
                              setImgUrl(reader.result);
                              upLoadImg(file);
                            }
                          };
                          reader.readAsDataURL(file);
                        });
                      }}
                    >
                      <CameraOutlined
                        style={{
                          fontSize: "2rem",
                        }}
                      />
                    </Upload>
                  </ImgCrop>
                </Form.Item>
              </div>
            </div>
            <div className="details__group">
              <Form.Item
                name="firstName"
                label={<Text>H??? ng?????i li??n h???</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "H???"
                    ),
                  },
                  {
                    pattern:
                      /^[a-zA-ZaA????????????????????????????????????????????????????????????????????????????????????????????bBcCdD????eE???????????????????????????????????????????????????????????? fFgGhHiI????????????????????????jJkKlLmMnNoO????????????????????????????????????????????????????????????????????????????????????????????pPqQrRsStTu U??????????????????????????????????????????????????????????vVwWxXyY????????????????????????????zZ\s]{2,10}$/,
                    message: getMessage(
                      CODE_ERROR.ERROR_FORMAT,
                      MESSAGE_ERROR,
                      "H???"
                    ),
                  },
                  {
                    max: 10,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MAX,
                      MESSAGE_ERROR,
                      "H???",
                      10
                    ),
                  },
                  {
                    min: 2,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MIN,
                      MESSAGE_ERROR,
                      "T??n",
                      2
                    ),
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="lastName"
                label={<Text>T??n ?????m ng?????i li??n h???</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "T??n ?????m"
                    ),
                  },
                  {
                    pattern:
                      /^[a-zA-ZaA????????????????????????????????????????????????????????????????????????????????????????????bBcCdD????eE???????????????????????????????????????????????????????????? fFgGhHiI????????????????????????jJkKlLmMnNoO????????????????????????????????????????????????????????????????????????????????????????????pPqQrRsStTu U??????????????????????????????????????????????????????????vVwWxXyY????????????????????????????zZ\s]{2,50}$/,
                    message: getMessage(
                      CODE_ERROR.ERROR_FORMAT,
                      MESSAGE_ERROR,
                      "T??n ?????m"
                    ),
                  },
                  {
                    max: 50,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MAX,
                      MESSAGE_ERROR,
                      "T??n ?????m",
                      50
                    ),
                  },
                  {
                    min: 2,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MIN,
                      MESSAGE_ERROR,
                      "T??n ?????m",
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

              <Form.Item
                name="shopName"
                label={<Text>T??n c???a h??ng</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "T??n c???a h??ng"
                    ),
                  },
                  {
                    pattern:
                      /^[a-zA-Z0-9aA????????????????????????????????????????????????????????????????????????????????????????????bBcCdD????eE???????????????????????????????????????????????????????????? fFgGhHiI????????????????????????jJkKlLmMnNoO????????????????????????????????????????????????????????????????????????????????????????????pPqQrRsStTu U??????????????????????????????????????????????????????????vVwWxXyY????????????????????????????zZ\s]{2,50}$/,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_LETTER,
                      MESSAGE_ERROR,
                      "T??n c???a h??ng"
                    ),
                  },
                  {
                    max: 50,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MAX,
                      MESSAGE_ERROR,
                      "T??n c???a h??ng",
                      50
                    ),
                  },
                  {
                    min: 2,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MIN,
                      MESSAGE_ERROR,
                      "T??n c???a h??ng",
                      2
                    ),
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="taxCode"
                label={<Text>M?? s??? thu???</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "M?? s??? thu???"
                    ),
                  },
                  {
                    pattern: /^[0-9]{10,13}$/,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER,
                      MESSAGE_ERROR,
                      "M?? s??? thu???"
                    ),
                  },
                  {
                    max: 13,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MAX,
                      MESSAGE_ERROR,
                      "M?? s??? thu???",
                      13
                    ),
                  },
                  {
                    min: 10,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MIN,
                      MESSAGE_ERROR,
                      "M?? s??? thu???",
                      10
                    ),
                  },
                ]}
              >
                <Input />
              </Form.Item>

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
                T???o m???i
              </Button>
            </div>
          </Form>
        </Spin>
      </Modal>
    </>
  );
}
