import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import "./EmployeeDetailsForm.css";
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
  Radio,
  Select,
  DatePicker,
  Switch,
  Upload,
  Tag,
  Divider,
  Typography,
  message,
  Spin,
  notification,
  Steps,
} from "antd";
import {
  createDetails,
  updateDetails,
  getEmployeeDetails,
} from "features/employee-manager/employeeManager";
import { useDispatch, useSelector } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { getUserName } from "helpers/auth.helpers";
import { storage } from "firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";

import { CODE_ERROR } from "constants/errors.constants";
import { MESSAGE_ERROR } from "constants/messages.constants";
import { getMessage } from "helpers/util.helper";
import { getDistrict, getProvince } from "features/provinces/provinces";
import { useParams } from "react-router-dom";
import { updateAvatar } from "features/auth/auth";

import newFileImg from "assets/icons/newFile.png";
import deleteFileImg from "assets/icons/deleteFile.png";
import uploadFileImg from "assets/icons/uploadFile.png";
import uploadImageImg from "assets/icons/uploadImage.png";
import resetFileImg from "assets/icons/resetFile.png";
import minusButtonImg from "assets/icons/minusButton.png";

const { Option } = Select;
const { Text, Title } = Typography;
const { Step } = Steps;

function EmployeeDetailsForm({ updateNew }) {
  const { dataDetails, createMode } = useSelector((state) => state.employee);
  const { email, role } = useSelector((state) => state.auth);
  const { provinces, districts, wards } = useSelector(
    (state) => state.provinces
  );

  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const [isLoading, setIsLoading] = useState(false);
  const [imgURL, setImgUrl] = useState(null);
  const [status, setStatus] = useState(null);
  const [birthDay, setBirthDay] = useState(null);

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

  const onChangeBirthDay = (value, dateString) => {
    setBirthDay(dateString);
  };

  const onFinish = async ({ city, district, ward, ...args }) => {
    setIsLoading(true);

    if (createMode) {
      const bd =
        birthDay === null ? dayjs().utc().format("YYYY-MM-DD") : birthDay;

      dispatch(
        createDetails({
          data: {
            city: city.value,
            district: district.value,
            ward: ward.value,
            ...args,
            status: 1,
            birthDay: bd,
            fileAttachDTO: {
              filePath: imgURL === null ? "" : imgURL,
            },
          },
        })
      )
        .then(unwrapResult)
        .then((res) => {
          dispatch(getEmployeeDetails(res.id))
            .then(unwrapResult)
            .then((res) => {
              dispatch(updateAvatar(imgURL));
            })
            .then(() => {
              setIsLoading(false);
              notification.success({
                message: "Thông tin nhân viên",
                description: "Tạo thông tin Nhân viên thành công",
              });
            });
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
          notification.error({
            message: "Thông tin nhân viên",
            description: "Tạo thông tin Nhân viên thất bại",
          });
        });
    } else {
      const bd = birthDay === null ? initialValues.birthDay : birthDay;
      const stt = status === null ? initialValues.status : status;

      dispatch(
        updateDetails({
          id: dataDetails.id,
          data: {
            city: typeof city === "string" ? city : city.value,
            district: typeof district === "string" ? district : district.value,
            ward: typeof ward === "string" ? ward : ward.value,
            ...args,
            status: 1,
            birthDay: bd,
            fileAttachDTO: {
              filePath: imgURL === null ? "" : imgURL,
            },
          },
        })
      )
        .then(unwrapResult)
        .then((res) => {
          dispatch(getEmployeeDetails(dataDetails.id))
            .then(unwrapResult)
            .then((res) => {
              if (role !== "admin") {
                dispatch(updateAvatar(imgURL));
              }
            })
            .then(() => {
              setIsLoading(false);
              notification.success({
                message: "Thông tin nhân viên",
                description: "Cập nhật thông tin Nhân viên thành công",
              });
            });
        })
        .catch((error) => {
          console.log(error);
          setIsLoading(false);
          notification.success({
            message: "Thông tin nhân viên",
            description: "Cập nhật thông tin Nhân viên thất bại",
          });
          //  dispatch(updateError(CODE_ERROR.ERROR_LOGIN));
        });
    }
  };

  const defaultValues = {
    status: 0,
    gender: true,
    email: email,
  };
  const initialValues = createMode ? defaultValues : dataDetails;

  useEffect(() => {
    form.setFieldsValue(initialValues);

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
        form={form}
        layout="horizontal"
        name="form"
        initialValues={initialValues}
        onFinish={onFinish}
        colon={false}
        className="employee"
      >
        <div className="employee-details">
          <div className="actions-group">
            {updateNew ? (
              <Title level={3} style={{ marginBottom: 0, marginRight: "auto" }}>
                Cập nhật thông tin
              </Title>
            ) : (
              <Title level={3} style={{ marginBottom: 0, marginRight: "auto" }}>
                {createMode ? "Tạo mới Nhân viên" : "Chi tiết nhân viên"}
              </Title>
            )}

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
                {updateNew ? "Cập nhật" : "Tạo mới"}
              </Button>
            )}
          </div>

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

              {!createMode && (
                <>
                  <div className="details__fullname">
                    {`${dataDetails?.firstName} ${dataDetails?.lastName}`}
                  </div>
                  <div className="details__username">{`@${getUserName()}`}</div>

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
                    {`${dataDetails?.district}, ${dataDetails?.city}`}
                  </div>

                  {dataDetails?.status === 1 ? (
                    <Tag color="success" className="details__status">
                      Hoạt động
                    </Tag>
                  ) : (
                    <Tag color="error" className="details__status">
                      Không hoạt động
                    </Tag>
                  )}
                </>
              )}
            </div>

            <div className="details__right">
              <Steps direction="vertical" className="list-data">
                <Step
                  title="Thông tin liên hệ"
                  status="finish"
                  description={
                    <div className="group-data">
                      <Form.Item
                        name="firstName"
                        label={<Text>Họ</Text>}
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
                              "Họ",
                              2
                            ),
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        name="lastName"
                        label={<Text>Tên</Text>}
                        className="details__item"
                        rules={[
                          {
                            required: true,
                            message: getMessage(
                              CODE_ERROR.ERROR_REQUIRED,
                              MESSAGE_ERROR,
                              "Tên"
                            ),
                          },
                          {
                            pattern:
                              /^[a-zA-ZaAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆ fFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTu UùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ\s]{2,50}$/,
                            message: getMessage(
                              CODE_ERROR.ERROR_FORMAT,
                              MESSAGE_ERROR,
                              "Tên"
                            ),
                          },
                          {
                            max: 50,
                            message: getMessage(
                              CODE_ERROR.ERROR_NUMBER_MAX,
                              MESSAGE_ERROR,
                              "Tên",
                              50
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
                        name="email"
                        label={<Text>Email</Text>}
                        className="details__item"
                        rules={[
                          {
                            required: true,
                            message: getMessage(
                              CODE_ERROR.ERROR_REQUIRED,
                              MESSAGE_ERROR,
                              "Email"
                            ),
                          },
                          {
                            type: "email",
                            message: getMessage(
                              CODE_ERROR.ERROR_EMAIL,
                              MESSAGE_ERROR,
                              "Email"
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
                        name="idNumber"
                        label={<Text>Mã định danh</Text>}
                        className="details__item"
                        rules={[
                          {
                            required: true,
                            message: getMessage(
                              CODE_ERROR.ERROR_REQUIRED,
                              MESSAGE_ERROR,
                              "Mã số"
                            ),
                          },
                          {
                            pattern: /^[0-9]{8,12}$/,
                            message: getMessage(
                              CODE_ERROR.ERROR_FORMAT_NUMBER,
                              MESSAGE_ERROR,
                              "Mã số"
                            ),
                          },
                          {
                            max: 12,
                            message: getMessage(
                              CODE_ERROR.ERROR_NUMBER_MAX,
                              MESSAGE_ERROR,
                              "Mã số",
                              12
                            ),
                          },
                          {
                            min: 8,
                            message: getMessage(
                              CODE_ERROR.ERROR_NUMBER_MIN,
                              MESSAGE_ERROR,
                              "Mã số",
                              8
                            ),
                          },
                        ]}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        name="gender"
                        label={<Text>Giới tính</Text>}
                        className="details__item"
                      >
                        <Radio.Group>
                          <Radio value={true}>Nam</Radio>
                          <Radio value={false}>Nữ</Radio>
                        </Radio.Group>
                      </Form.Item>

                      <Form.Item
                        label={<Text>Ngày sinh</Text>}
                        className="details__item"
                        rules={[
                          {
                            required: true,
                            message: getMessage(
                              CODE_ERROR.ERROR_REQUIRED,
                              MESSAGE_ERROR,
                              "Ngày sinh"
                            ),
                          },
                        ]}
                      >
                        <DatePicker
                          defaultValue={
                            createMode
                              ? dayjs()
                              : dayjs(dataDetails?.birthDay, "YYYY-MM-DD")
                          }
                          format={"YYYY-MM-DD"}
                          onChange={onChangeBirthDay}
                        />
                      </Form.Item>

                      {!createMode && (
                        <Form.Item
                          label={<Text>Trạng thái Hoạt động</Text>}
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
                      )}
                    </div>
                  }
                />

                <Step
                  title="Địa chỉ nhân viên"
                  status="finish"
                  description={
                    <div className="group-data">
                      <Form.Item
                        name="apartmentNumber"
                        label={<Text>Tên đường, Số nhà</Text>}
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
                            // dispatch(
                            // 		 getDistrict(value.key)
                            // );
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

                <Step title="" status="finish" />
              </Steps>
            </div>
          </div>
        </div>
      </Form>
    </Spin>
  );
}

export default React.memo(EmployeeDetailsForm);
