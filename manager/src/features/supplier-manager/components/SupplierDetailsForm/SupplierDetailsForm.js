import React, { useEffect, useState } from "react";
import "./SupplierDetailsForm.css";
import avt_default from "assets/images/avt-default.png";
import {
  CameraOutlined,
  CaretUpOutlined,
  HighlightOutlined,
} from "@ant-design/icons";
import ImgCrop from "antd-img-crop";
import {
  Form,
  Input,
  Button,
  Select,
  Switch,
  Upload,
  Tag,
  Divider,
  Typography,
  message,
  Spin,
  Steps,
  notification,
} from "antd";
import { updateDetails } from "features/supplier-manager/supplierManager";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { unwrapResult } from "@reduxjs/toolkit";
import { storage } from "firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import {
  getDistrict,
  getProvince,
  getProvinces,
} from "features/provinces/provinces";
import { CODE_ERROR } from "constants/errors.constants";
import { MESSAGE_ERROR } from "constants/messages.constants";
import { getMessage } from "helpers/util.helper";

import newFileImg from "assets/icons/newFile.png";
import deleteFileImg from "assets/icons/deleteFile.png";
import uploadFileImg from "assets/icons/uploadFile.png";
import uploadImageImg from "assets/icons/uploadImage.png";
import resetFileImg from "assets/icons/resetFile.png";
import minusButtonImg from "assets/icons/minusButton.png";
import DetailsModal from "../DetailsModal/DetailsModal";
import TableDetails from "../TableDetails/TableDetails";

const { TextArea } = Input;
const { Option } = Select;
const { Paragraph, Text } = Typography;
const { Step } = Steps;
const { Title } = Typography;

function SupplierDetailsForm() {
  const { dataDetails, createMode } = useSelector((state) => state.supplier);
  const { provinces, districts, wards } = useSelector(
    (state) => state.provinces
  );

  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const [formSupplier] = Form.useForm();

  const [isLoading, setIsLoading] = useState(false);
  const [imgURL, setImgUrl] = useState(null);
  const [status, setStatus] = useState(null);
  const [birthDay, setBirthDay] = useState(null);

  const initialValues = dataDetails ? dataDetails : {};

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

  const onFinishUpdate = async (values) => {
    console.log(values);
    dispatch(
      updateDetails({
        id: dataDetails.id,
        data: {
          ...values,
          address: {
            ...values.address,
            city:
              typeof values.address.city === "string"
                ? values.address.city
                : values.address.city.value,
            district:
              typeof values.address.district === "string"
                ? values.address.district
                : values.address.district.value,
            ward:
              typeof values.address.ward === "string"
                ? values.address.ward
                : values.address.ward.value,
          },
          status: 1,
          avatarSupplier: imgURL === null ? "" : imgURL,
        },
      })
    )
      .then(unwrapResult)
      .then((res) => {
        console.log(res);
        notification.success({
          message: "Chi tiết Nhà cung cấp",
          description: "Cập nhật thông tin thành công",
        });
      })
      .catch((error) => {
        console.log(error);
        console.log(dataDetails.id);
        notification.error({
          message: "Chi tiết Nhà cung cấp",
          description: "Cập nhật thông tin thất bại",
        });
      });
  };

  useEffect(() => {
    formSupplier.setFieldsValue(initialValues);
    if (!createMode && initialValues !== null) {
      setImgUrl(initialValues.avatarSupplier);
    }
  }, [dispatch, createMode, initialValues]);

  if (!initialValues) {
    return <Spin spinning={true} />;
  }

  return (
    <Spin spinning={isLoading}>
      <Form
        form={formSupplier}
        name="dynamic_form_nest_item"
        onFinish={onFinishUpdate}
        autoComplete="off"
        className="product"
        layout="vertical"
        initialValues={initialValues}
      >
        <div className="product-details">
          <div className="actions-group">
            <Title level={3} style={{ marginBottom: 0, marginRight: "auto" }}>
              {createMode ? "Tạo nhà Cung cấp" : "Chi tiết nhà Cung cấp"}
            </Title>

            <Button
              type="primary"
              shape="round"
              size={"large"}
              htmlType="reset"
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
            >
              <img
                src={resetFileImg}
                alt=""
                style={{ height: "2.5rem", width: "2.5rem" }}
              />
              Đặt lại
            </Button>

            {!createMode && (
              <>
                <Button
                  type="danger"
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
                  //    onClick={() => onDeleteProductExport()}
                >
                  <img
                    src={deleteFileImg}
                    alt=""
                    style={{ height: "2.5rem", width: "2.5rem" }}
                  />
                  Xoá bỏ
                </Button>
                <Button
                  type="primary"
                  shape="round"
                  size={"large"}
                  htmlType="submit"
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
                >
                  <img
                    src={uploadFileImg}
                    alt=""
                    style={{ height: "2.5rem", width: "2.5rem" }}
                  />
                  Cập nhật
                </Button>
              </>
            )}

            {createMode && (
              <Button
                type="primary"
                shape="round"
                size={"large"}
                htmlType="submit"
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
              >
                <img
                  src={newFileImg}
                  alt=""
                  style={{ height: "2.5rem", width: "2.5rem" }}
                />
                Tạo mới
              </Button>
            )}
          </div>

          <div className="details">
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
                // rules={[
                //   {
                //     required: true,
                //     message: getMessage(
                //       CODE_ERROR.ERROR_REQUIRED,
                //       MESSAGE_ERROR,
                //       "Avatar"
                //     ),
                //   },
                // ]}
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

            <Steps direction="vertical" className="list-data">
              <Step
                title="Thông tin liên hệ"
                status="finish"
                description={
                  <div className="group-data">
                    <Form.Item
                      name="supplierName"
                      label={<Text>Tên Nhà cung cấp</Text>}
                      className="details__item"
                      rules={[
                        {
                          required: true,
                          message: getMessage(
                            CODE_ERROR.ERROR_REQUIRED,
                            MESSAGE_ERROR,
                            "Tên Nhà cung cấp"
                          ),
                        },
                        {
                          pattern:
                            /^[a-zA-Z0-9ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]{2,50}$/,
                          message: getMessage(
                            CODE_ERROR.ERROR_NUMBER_LETTER,
                            MESSAGE_ERROR,
                            "Tên Nhà cung cấp"
                          ),
                        },
                        {
                          max: 50,
                          message: getMessage(
                            CODE_ERROR.ERROR_NUMBER_MAX,
                            MESSAGE_ERROR,
                            "Supplier Name",
                            50
                          ),
                        },
                        {
                          min: 2,
                          message: getMessage(
                            CODE_ERROR.ERROR_NUMBER_MIN,
                            MESSAGE_ERROR,
                            "Tên Nhà cung cấp",
                            2
                          ),
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name="firstContactName"
                      label={<Text>Họ của người liên hệ</Text>}
                      className="details__item"
                      rules={[
                        {
                          required: true,
                          message: getMessage(
                            CODE_ERROR.ERROR_REQUIRED,
                            MESSAGE_ERROR,
                            "Họ của người liên hệ"
                          ),
                        },
                        {
                          pattern:
                            /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]{2,10}$/,
                          message: getMessage(
                            CODE_ERROR.ERROR_FORMAT,
                            MESSAGE_ERROR,
                            "Họ của người liên hệ"
                          ),
                        },
                        {
                          max: 10,
                          message: getMessage(
                            CODE_ERROR.ERROR_NUMBER_MAX,
                            MESSAGE_ERROR,
                            "Họ của người liên hệ",
                            10
                          ),
                        },
                        {
                          min: 2,
                          message: getMessage(
                            CODE_ERROR.ERROR_NUMBER_MIN,
                            MESSAGE_ERROR,
                            "Họ của người liên hệ",
                            2
                          ),
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name="lastContactName"
                      label={<Text>Tên của người liên hệ</Text>}
                      className="details__item"
                      rules={[
                        {
                          required: true,
                          message: getMessage(
                            CODE_ERROR.ERROR_REQUIRED,
                            MESSAGE_ERROR,
                            "Tên của người liên hệ"
                          ),
                        },
                        {
                          pattern:
                            /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ\s]{2,20}$/,
                          message: getMessage(
                            CODE_ERROR.ERROR_FORMAT,
                            MESSAGE_ERROR,
                            "Tên của người liên hệ"
                          ),
                        },
                        {
                          max: 20,
                          message: getMessage(
                            CODE_ERROR.ERROR_NUMBER_MAX,
                            MESSAGE_ERROR,
                            "Tên của người liên hệ",
                            20
                          ),
                        },
                        {
                          min: 2,
                          message: getMessage(
                            CODE_ERROR.ERROR_NUMBER_MIN,
                            MESSAGE_ERROR,
                            "Tên của người liên hệ",
                            2
                          ),
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name="phoneNumberContact"
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
                      name="bankName"
                      label={<Text>Tên ngân hàng</Text>}
                      className="details__item"
                      rules={[
                        {
                          required: true,
                          message: getMessage(
                            CODE_ERROR.ERROR_REQUIRED,
                            MESSAGE_ERROR,
                            "Tên ngân hàng"
                          ),
                        },
                        {
                          max: 10,
                          message: getMessage(
                            CODE_ERROR.ERROR_NUMBER_MAX,
                            MESSAGE_ERROR,
                            "Tên ngân hàng",
                            10
                          ),
                        },
                        {
                          min: 2,
                          message: getMessage(
                            CODE_ERROR.ERROR_NUMBER_MIN,
                            MESSAGE_ERROR,
                            "Tên ngân hàng",
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
                      label={<Text>Trạng thái hoạt động</Text>}
                      className="details__item"
                    >
                      <Switch
                        checked={
                          status === null ? initialValues.status : status
                        }
                        onChange={(checked) => setStatus(checked)}
                        disabled={false}
                      />
                    </Form.Item>
                  </div>
                }
              />

              <Step
                title="Địa chỉ Nhà cung cấp"
                status="finish"
                description={
                  <div className="group-data">
                    <Form.Item
                      name={["address", "apartmentNumber"]}
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
                      name={["address", "city"]}
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
                        }}
                        placeholder="Search to Select"
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
                            <Option value={p.name} key={p.code}>
                              {`${p.name}`}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name={["address", "district"]}
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
                        }}
                        placeholder="Search to Select"
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
                            <Option value={d.name} key={d.code}>
                              {`${d.name}`}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name={["address", "ward"]}
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
                        placeholder="Search to Select"
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
                            <Option value={w.name} key={w.code}>
                              {`${w.name}`}
                            </Option>
                          );
                        })}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      name="description"
                      label={<Text>Mô tả</Text>}
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
                }
              />

              <Step
                title={
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      width: "100%",
                    }}
                  >
                    <div>Công nợ</div>
                    <DetailsModal updateMode={false} record={initialValues} />
                  </div>
                }
                status="finish"
                description={<TableDetails form={formSupplier} />}
              />

              <Step title="" status="finish" />
            </Steps>
          </div>
        </div>
      </Form>
    </Spin>
  );
}

export default React.memo(SupplierDetailsForm);
