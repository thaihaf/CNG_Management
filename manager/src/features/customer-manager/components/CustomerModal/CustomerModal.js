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
              message: "Tạo mới Khách hàng",
              description: "Tạo mới Khách hàng thành công",
            });
          })
          .catch(() => {
            setIsLoading(false);
            notification.error({
              message: "Tải danh sách Khách hàng",
              description: "Tải danh sách Khách hàng thất bại",
            });
          });
      })
      .catch((error) => {
        setIsLoading(false);
        notification.error({
          message: "Tạo mới Khách hàng",
          description: "Tạo mới Khách hàng thất bại",
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
        Tạo Khách hàng
      </Button>

      <Modal
        title={"Tạo mới Khách hàng"}
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
                label={<Text>Họ người liên hệ</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "Họ"
                    ),
                  },
                  {
                    pattern:
                      /^[a-zA-ZaAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆ fFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTu UùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ\s]{2,10}$/,
                    message: getMessage(
                      CODE_ERROR.ERROR_FORMAT,
                      MESSAGE_ERROR,
                      "Họ"
                    ),
                  },
                  {
                    max: 10,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MAX,
                      MESSAGE_ERROR,
                      "Họ",
                      10
                    ),
                  },
                  {
                    min: 2,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MIN,
                      MESSAGE_ERROR,
                      "Tên",
                      2
                    ),
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="lastName"
                label={<Text>Tên đệm người liên hệ</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "Tên đệm"
                    ),
                  },
                  {
                    pattern:
                      /^[a-zA-ZaAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆ fFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTu UùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ\s]{2,50}$/,
                    message: getMessage(
                      CODE_ERROR.ERROR_FORMAT,
                      MESSAGE_ERROR,
                      "Tên đệm"
                    ),
                  },
                  {
                    max: 50,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MAX,
                      MESSAGE_ERROR,
                      "Tên đệm",
                      50
                    ),
                  },
                  {
                    min: 2,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MIN,
                      MESSAGE_ERROR,
                      "Tên đệm",
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

              <Form.Item
                name="shopName"
                label={<Text>Tên cửa hàng</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "Tên cửa hàng"
                    ),
                  },
                  {
                    pattern:
                      /^[a-zA-Z0-9aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆ fFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTu UùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ\s]{2,50}$/,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_LETTER,
                      MESSAGE_ERROR,
                      "Tên cửa hàng"
                    ),
                  },
                  {
                    max: 50,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MAX,
                      MESSAGE_ERROR,
                      "Tên cửa hàng",
                      50
                    ),
                  },
                  {
                    min: 2,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MIN,
                      MESSAGE_ERROR,
                      "Tên cửa hàng",
                      2
                    ),
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="taxCode"
                label={<Text>Mã số thuế</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "Mã số thuế"
                    ),
                  },
                  {
                    pattern: /^[0-9]{10,13}$/,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER,
                      MESSAGE_ERROR,
                      "Mã số thuế"
                    ),
                  },
                  {
                    max: 13,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MAX,
                      MESSAGE_ERROR,
                      "Mã số thuế",
                      13
                    ),
                  },
                  {
                    min: 10,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MIN,
                      MESSAGE_ERROR,
                      "Mã số thuế",
                      10
                    ),
                  },
                ]}
              >
                <Input />
              </Form.Item>

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
                Tạo mới
              </Button>
            </div>
          </Form>
        </Spin>
      </Modal>
    </>
  );
}
