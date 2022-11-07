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
const { TextArea } = Input;
const { Option } = Select;
const { Paragraph, Text } = Typography;

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
        message.success("Update success!");
      })
      .catch((error) => {
        console.log(error);
        console.log(dataDetails.id);
        message.error("Update failed!!!");
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
      <div className="details">
        <div className="details__left">
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
              rules={[
                {
                  required: true,
                  message: getMessage(
                    CODE_ERROR.ERROR_REQUIRED,
                    MESSAGE_ERROR,
                    "Avatar"
                  ),
                },
              ]}
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
          <>
            <div className="details__fullname">
              {`${dataDetails?.supplierName}`}
            </div>
            <div className="details__username">
              {`${dataDetails?.firstContactName} ${dataDetails?.lastContactName}`}
            </div>

            <div className="details__location">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-map-pin"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <circle cx="12" cy="11" r="3"></circle>
                <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z"></path>
              </svg>
              {`${dataDetails?.address.district}, ${dataDetails?.address.city}`}
            </div>

            {dataDetails?.status === 1 ? (
              <Tag color="success" className="details__status">
                Active
              </Tag>
            ) : (
              <Tag color="error" className="details__status">
                Inactive
              </Tag>
            )}
          </>
        </div>

        <div className="details__right">
          <Form
            form={formSupplier}
            layout="horizontal"
            name="form"
            initialValues={initialValues}
            onFinish={onFinishUpdate}
            colon={false}
          >
            <div className="details__group">
              <Form.Item
                name="supplierName"
                label={<Text>Supplier Name</Text>}
                className="details__item"
                rules={[
                    {
                      required: true,
                      message: getMessage(
                        CODE_ERROR.ERROR_REQUIRED,
                        MESSAGE_ERROR,
                        "Supplier Name"
                      ),
                    },
                    {
                      max: 25,
                      message: getMessage(
                        CODE_ERROR.ERROR_NUMBER_MAX,
                        MESSAGE_ERROR,
                        "Supplier Name",
                        25
                      ),
                    },
                    {
                      min: 2,
                      message: getMessage(
                        CODE_ERROR.ERROR_NUMBER_MIN,
                        MESSAGE_ERROR,
                        "Supplier Name",
                        2
                      ),
                    },
                  ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                label={<Text>Active Status</Text>}
                className="details__item"
              >
                <Switch
                  checked={status === null ? initialValues.status : status}
                  onChange={(checked) => setStatus(checked)}
                  disabled={false}
                />
              </Form.Item>
            </div>

            <div className="details__group">
              <Form.Item
                name="firstContactName"
                label={<Text>First Contact Name</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "First Contact Name"
                    ),
                  },
                  {
                      pattern: /^[a-zA-Z]{2,10}$/,
                      message: getMessage(
                        CODE_ERROR.ERROR_FORMAT,
                        MESSAGE_ERROR,
                        "First Contact Name"
                      ),
                    },
                  {
                    max: 10,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MAX,
                      MESSAGE_ERROR,
                      "First Contact Name",
                      10
                    ),
                  },
                  {
                    min: 2,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MIN,
                      MESSAGE_ERROR,
                      "First Contact Name",
                      2
                    ),
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="lastContactName"
                label={<Text>Last Contact Name</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "Last Contact Name"
                    ),
                  },
                  {
                      pattern: /^[a-zA-Z ]{2,20}$/,
                      message: getMessage(
                        CODE_ERROR.ERROR_FORMAT,
                        MESSAGE_ERROR,
                        "Last Contact Name"
                      ),
                    },
                  {
                    max: 20,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MAX,
                      MESSAGE_ERROR,
                      "Last Contact Name",
                      20
                    ),
                  },
                  {
                    min: 2,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MIN,
                      MESSAGE_ERROR,
                      "Last Contact Name",
                      2
                    ),
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </div>

            <div className="details__group">
              <Form.Item
                name="bankName"
                label={<Text>Bank Name</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "Bank Name"
                    ),
                  },
                  {
                    max: 10,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MAX,
                      MESSAGE_ERROR,
                      "Bank Name",
                      10
                    ),
                  },
                  {
                    min: 2,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MIN,
                      MESSAGE_ERROR,
                      "Bank Name",
                      2
                    ),
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="phoneNumberContact"
                label={<Text>Phone Number Contact</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "Phone Number Contact"
                    ),
                  },
                  {
                      pattern: /^[0]{1}[0-9]{9,10}$/,
                      message: getMessage(
                        CODE_ERROR.ERROR_FORMAT_NUMBER,
                        MESSAGE_ERROR,
                        "Phone Number Contact"
                      ),
                    },
                  {
                    max: 10,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MAX,
                      MESSAGE_ERROR,
                      "Phone Number Contact",
                      10
                    ),
                  },
                  {
                    min: 9,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MIN,
                      MESSAGE_ERROR,
                      "Phone Number Contact",
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
                name="bankAccountNumber"
                label={<Text>Bank Account Number</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "Bank Account Number"
                    ),
                  },
                  {
                      pattern: /^[1-9]{1}[0-9]{5,14}$/,
                      message: getMessage(
                        CODE_ERROR.ERROR_FORMAT_NUMBER,
                        MESSAGE_ERROR,
                        "Bank Account Number"
                      ),
                    },
                  {
                    max: 14,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MAX,
                      MESSAGE_ERROR,
                      "Bank Account Number",
                      14
                    ),
                  },
                  {
                    min: 5,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MIN,
                      MESSAGE_ERROR,
                      "Bank Account Number",
                      5
                    ),
                  },
                ]}
              >
                <Input />
              </Form.Item>
            </div>

            <div className="details__group">
              <Form.Item
                name="taxCode"
                label={<Text>Tax Code</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "Tax Code"
                    ),
                  },
                  {
                      pattern: /^[0-9]{10,13}$/,
                      message: getMessage(
                        CODE_ERROR.ERROR_NUMBER,
                        MESSAGE_ERROR,
                        "Tax Code"
                      ),
                    },
                  {
                    max: 13,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MAX,
                      MESSAGE_ERROR,
                      "Tax Code",
                      13
                    ),
                  },
                  {
                    min: 10,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MIN,
                      MESSAGE_ERROR,
                      "Tax Code",
                      10
                    ),
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="description"
                label={<Text>Description</Text>}
                className="details__item"
              >
                <Input />
              </Form.Item>
            </div>

            <div className="details__group">
              <Form.Item
                name={["address", "apartmentNumber"]}
                label={<Text>Street Name, House No</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "Street Name, House No"
                    ),
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <Form.Item
                name={["address", "city"]}
                label={<Text>City</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "City"
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
            </div>

            <div className="details__group">
              <Form.Item
                name={["address", "district"]}
                label={<Text>District</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "District"
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
                label={<Text>Ward</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "Ward"
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
            </div>

            <Divider />

            <div className="details__group">
              <Form.Item className="details__items">
                <Button
                  type="primary"
                  shape="round"
                  icon={<CaretUpOutlined />}
                  size={"large"}
                  htmlType="submit"
                  style={{
                    width: "100%",
                    height: "45px",
                  }}
                >
                  Update
                </Button>
              </Form.Item>
              <Form.Item className="details__item">
                <Button
                  type="primary"
                  shape="round"
                  icon={<HighlightOutlined />}
                  size={"large"}
                  htmlType="reset"
                  style={{
                    width: "100%",
                    height: "45px",
                  }}
                >
                  Reset
                </Button>
              </Form.Item>
            </div>
          </Form>
        </div>
      </div>
    </Spin>
  );
}

export default React.memo(SupplierDetailsForm);
