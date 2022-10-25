import React, { useEffect, useState } from "react";
import moment from "moment";
import "./CustomerDetailsForm.css";
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
import {
  updateDetails,
} from "features/customer-manager/customerManager";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { unwrapResult } from "@reduxjs/toolkit";
import { getUserName } from "helpers/auth.helpers";
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

function CustomerDetailsForm() {
  const { dataDetails, createMode } = useSelector((state) => state.customer);
  const { provinces, districts, wards } = useSelector(
    (state) => state.provinces
  );

  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const [formCustomer] = Form.useForm();

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

  const onFinishUpdate = async (values)=> {
    dispatch(
      updateDetails({
        id: dataDetails.id,
        data: {
          ...values,
        addressDTO: {
          ...values.addressDTO,
          city:
            typeof values.addressDTO.city === "string"
              ? values.addressDTO.city
              : values.addressDTO.city.value,
          district:
            typeof values.addressDTO.district === "string"
              ? values.addressDTO.district
              : values.addressDTO.district.value,
          ward:
            typeof values.addressDTO.ward === "string"
              ? values.addressDTO.ward
              : values.addressDTO.ward.value,
        },
          // taxCode:"3232401931",
          status: 1,
          fileAttachDTO: {
            filePath: imgURL === null ? "" : imgURL,
       },
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
        //  dispatch(updateError(CODE_ERROR.ERROR_LOGIN));
      });
  };

  useEffect(() => {
    formCustomer.setFieldsValue(initialValues);
    if (!createMode && initialValues !== null) {
      setImgUrl(initialValues.fileAttachDTO?.filePath);
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
              {`${dataDetails?.shopName}`}
            </div>

            <div className="details__username">{
              `${dataDetails?.firstName} ${dataDetails?.lastName}`}
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
              {`${dataDetails?.addressDTO.district}, ${dataDetails?.addressDTO.city}`}
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
            form={formCustomer}
            layout="horizontal"
            name="form"
            initialValues={initialValues}
            onFinish={onFinishUpdate}
            colon={false}
          >
            <div className="details__group">
              <Form.Item
                name="shopName"
                label={<Text>Shop Name</Text>}
                className="details__item"
                rules={[
                    {
                      required: true,
                      message: getMessage(
                        CODE_ERROR.ERROR_REQUIRED,
                        MESSAGE_ERROR,
                        "Shop Name"
                      ),
                    },
                    {
                      max: 25,
                      message: getMessage(
                        CODE_ERROR.ERROR_NUMBER_MAX,
                        MESSAGE_ERROR,
                        "Shop Name",
                        25
                      ),
                    },
                    {
                      min: 2,
                      message: getMessage(
                        CODE_ERROR.ERROR_NUMBER_MIN,
                        MESSAGE_ERROR,
                        "Shop Name",
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
                name="firstName"
                label={<Text>First Name</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "First Name"
                    ),
                  },
                  {
                    max: 10,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MAX,
                      MESSAGE_ERROR,
                      "First Name",
                      10
                    ),
                  },
                  {
                    min: 2,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MIN,
                      MESSAGE_ERROR,
                      "First Name",
                      2
                    ),
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="lastName"
                label={<Text>Last Name</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "Last Name"
                    ),
                  },
                  {
                    max: 20,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MAX,
                      MESSAGE_ERROR,
                      "Last Name",
                      20
                    ),
                  },
                  {
                    min: 2,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MIN,
                      MESSAGE_ERROR,
                      "Last Name",
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
                name="phoneNumber"
                label={<Text>Phone Number</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "Phone Number"
                    ),
                  },
                  {
                    max: 10,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MAX,
                      MESSAGE_ERROR,
                      "Phone Number",
                      10
                    ),
                  },
                  {
                    min: 9,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MIN,
                      MESSAGE_ERROR,
                      "Phone Number",
                      9
                    ),
                  },
                ]}
              >
                <Input />
              </Form.Item>
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
            </div>

            <div className="details__group">
              <Form.Item
                name={["addressDTO", "apartmentNumber"]}
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
                name={["addressDTO", "city"]}
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
                name={["addressDTO", "district"]}
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
                name={["addressDTO", "ward"]}
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
                  onChange={(value, e) => {
                    console.log(value.value);
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

export default React.memo(CustomerDetailsForm);
