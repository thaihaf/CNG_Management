import React, { useEffect, useState } from "react";
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
  Steps,
  notification,
} from "antd";
import { updateDetails } from "features/customer-manager/customerManager";
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

  const onFinishUpdate = async (values) => {
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
        notification.success({
          message: "Kh??ch h??ng",
          description: "Kh??ch h??ng th??nh c??ng",
        });
      })
      .catch((error) => {
        console.log(error);
        console.log(dataDetails.id);
        notification.error({
          message: "Kh??ch h??ng",
          description: "Kh??ch h??ng th???t b???i",
        });
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
      <Form
        form={formCustomer}
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
              {createMode ? "T???o Kh??ch h??ng" : "Chi ti???t Kh??ch h??ng"}
            </Title>

            <Button
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
              ?????t l???i
            </Button>

            {!createMode && (
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
                  C???p nh???t
                </Button>
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
                T???o m???i
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
                title="Th??ng tin li??n h???"
                status="finish"
                description={
                  <div className="group-data">
                    <Form.Item
                      name="shopName"
                      label={<Text>T??n C???a h??ng</Text>}
                      className="details__item"
                      rules={[
                        {
                          required: true,
                          message: getMessage(
                            CODE_ERROR.ERROR_REQUIRED,
                            MESSAGE_ERROR,
                            "T??n C???a h??ng"
                          ),
                        },
                        {
                          pattern:
                            /^[a-zA-Z0-9aA????????????????????????????????????????????????????????????????????????????????????????????bBcCdD????eE???????????????????????????????????????????????????????????? fFgGhHiI????????????????????????jJkKlLmMnNoO????????????????????????????????????????????????????????????????????????????????????????????pPqQrRsStTu U??????????????????????????????????????????????????????????vVwWxXyY????????????????????????????zZ\s]{2,50}$/,
                          message: getMessage(
                            CODE_ERROR.ERROR_NUMBER_LETTER,
                            MESSAGE_ERROR,
                            "T??n C???a h??ng"
                          ),
                        },
                        {
                          max: 50,
                          message: getMessage(
                            CODE_ERROR.ERROR_NUMBER_MAX,
                            MESSAGE_ERROR,
                            "Shop Name",
                            50
                          ),
                        },
                        {
                          min: 2,
                          message: getMessage(
                            CODE_ERROR.ERROR_NUMBER_MIN,
                            MESSAGE_ERROR,
                            "T??n C???a h??ng",
                            2
                          ),
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name="firstName"
                      label={<Text>H???</Text>}
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
                            "H???",
                            2
                          ),
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name="lastName"
                      label={<Text>T??n</Text>}
                      className="details__item"
                      rules={[
                        {
                          required: true,
                          message: getMessage(
                            CODE_ERROR.ERROR_REQUIRED,
                            MESSAGE_ERROR,
                            "T??n"
                          ),
                        },
                        {
                          pattern:
                            /^[a-zA-ZaA????????????????????????????????????????????????????????????????????????????????????????????bBcCdD????eE???????????????????????????????????????????????????????????? fFgGhHiI????????????????????????jJkKlLmMnNoO????????????????????????????????????????????????????????????????????????????????????????????pPqQrRsStTu U??????????????????????????????????????????????????????????vVwWxXyY????????????????????????????zZ\s]{2,50}$/,
                          message: getMessage(
                            CODE_ERROR.ERROR_FORMAT,
                            MESSAGE_ERROR,
                            "T??n"
                          ),
                        },
                        {
                          max: 50,
                          message: getMessage(
                            CODE_ERROR.ERROR_NUMBER_MAX,
                            MESSAGE_ERROR,
                            "T??n",
                            50
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
                          pattern: /^[0]{1}[0-9]{9,11}$/,
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
                      label={<Text>Tr???ng th??i ho???t ?????ng</Text>}
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
                title="?????a ch??? Kh??ch h??ng"
                status="finish"
                description={
                  <div className="group-data">
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
                            "T??n ???????ng, s??? nh??"
                          ),
                        },
                      ]}
                    >
                      <Input />
                    </Form.Item>
                    <Form.Item
                      name={["addressDTO", "city"]}
                      label={<Text>T???nh, Th??nh ph???</Text>}
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
                    <div>C??c kho???n ???? tr???</div>
                    <DetailsModal updateMode={false} record={initialValues} />
                  </div>
                }
                status="finish"
                description={<TableDetails form={formCustomer} />}
              />

              <Step title="" status="finish" />
            </Steps>
          </div>
        </div>
      </Form>
    </Spin>
  );
}

export default React.memo(CustomerDetailsForm);
