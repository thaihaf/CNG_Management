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

import "./SupplierModal.css";

const { Text } = Typography;
const { TextArea } = Input;

export default function SupplierModal() {
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
              message: "Tạo mới Nhà cung cấp",
              description: "Tạo mới Nhà cung cấp thành công",
            });
          })
          .catch(() => {
            setIsLoading(false);
            notification.error({
              message: "Tải danh sách Nhà cung cấp",
              description: "Tải danh sách Nhà cung cấp thất bại",
            });
          });
      })
      .catch((error) => {
        setIsLoading(false);
        notification.error({
          message: "Tạo mới Nhà cung cấp",
          description: "Tạo mới Nhà cung cấp thất bại",
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
        Tạo Nhà cung cấp
      </Button>

      <Modal
        title="Tạo mới Nhà cung cấp"
        style={{ top: 10 }}
        open={modal1Open}
        onOk={() => setModal1Open(false)}
        onCancel={() => setModal1Open(false)}
        footer={false}
        width={700}
        className="supplierModal"
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
                name="firstContactName"
                label={<Text>Họ của liên hệ</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "Họ của Người cung cấp"
                    ),
                  },
                  {
                    pattern:
                      /^[a-zA-ZaAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆ fFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTu UùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ\s]{2,10}$/,
                    message: getMessage(
                      CODE_ERROR.ERROR_FORMAT,
                      MESSAGE_ERROR,
                      "Họ của Người cung cấp"
                    ),
                  },
                  {
                    max: 10,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MAX,
                      MESSAGE_ERROR,
                      "Họ của Người cung cấp",
                      10
                    ),
                  },
                  {
                    min: 2,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MIN,
                      MESSAGE_ERROR,
                      "Họ của Người cung cấp",
                      2
                    ),
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="lastContactName"
                label={<Text>Tên đệm của người liên hệ</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "Tên của nhà cung cấp"
                    ),
                  },
                  {
                    pattern:
                      /^[a-zA-ZaAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆ fFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTu UùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ\s]{2,50}$/,
                    message: getMessage(
                      CODE_ERROR.ERROR_FORMAT,
                      MESSAGE_ERROR,
                      "Tên của nhà cung cấp"
                    ),
                  },
                  {
                    max: 50,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MAX,
                      MESSAGE_ERROR,
                      "Tên của nhà cung cấp",
                      50
                    ),
                  },
                  {
                    min: 2,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MIN,
                      MESSAGE_ERROR,
                      "Tên của nhà cung cấp",
                      2
                    ),
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="phoneNumberContact"
                label={<Text>Số điện thoại người liên hệ</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "Số điện thoại người liên hệ"
                    ),
                  },
                  {
                    pattern: /^[0]{1}[0-9]{9,10}$/,
                    message: getMessage(
                      CODE_ERROR.ERROR_FORMAT_NUMBER,
                      MESSAGE_ERROR,
                      "Số điện thoại người liên hệ"
                    ),
                  },
                  {
                    max: 11,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MAX,
                      MESSAGE_ERROR,
                      "Số điện thoại người liên hệ",
                      11
                    ),
                  },
                  {
                    min: 9,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MIN,
                      MESSAGE_ERROR,
                      "Số điện thoại người liên hệ",
                      9
                    ),
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name="supplierName"
                label={<Text>Tên nhà cung cấp</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "Tên nhà cung cấp"
                    ),
                  },
                  {
                    pattern:
                      /^[a-zA-Z0-9aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆ fFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTu UùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ\s]{2,50}$/,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_LETTER,
                      MESSAGE_ERROR,
                      "Tên nhà cung cấp"
                    ),
                  },
                  {
                    max: 50,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MAX,
                      MESSAGE_ERROR,
                      "Tên nhà cung cấp",
                      50
                    ),
                  },
                  {
                    min: 2,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MIN,
                      MESSAGE_ERROR,
                      "Tên nhà cung cấp",
                      2
                    ),
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="bankName"
                label={<Text>Tên Ngân hàng</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "Tên Ngân hàng"
                    ),
                  },
                  {
                    max: 10,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MAX,
                      MESSAGE_ERROR,
                      "Tên Ngân hàng",
                      10
                    ),
                  },
                  {
                    min: 2,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MIN,
                      MESSAGE_ERROR,
                      "Tên Ngân hàng",
                      2
                    ),
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="bankAccountNumber"
                label={<Text>Số tài khoản</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "Số tài khoản"
                    ),
                  },
                  {
                    pattern: /^[1-9]{1}[0-9]{5,14}$/,
                    message: getMessage(
                      CODE_ERROR.ERROR_FORMAT_NUMBER,
                      MESSAGE_ERROR,
                      "Số tài khoản"
                    ),
                  },
                  {
                    max: 14,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MAX,
                      MESSAGE_ERROR,
                      "Số tài khoản",
                      14
                    ),
                  },
                  {
                    min: 5,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MIN,
                      MESSAGE_ERROR,
                      "Số tài khoản",
                      5
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
                name="apartmentNumber"
                label={<Text>Tên đường, số nhà</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "Tên đường, số nhà"
                    ),
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="city"
                label={<Text>Tỉnh, Thành phố</Text>}
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
                    form.setFieldValue("district");
                    form.setFieldValue("ward");
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
                name="district"
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
                    form.setFieldValue("ward");
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
                name="ward"
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
