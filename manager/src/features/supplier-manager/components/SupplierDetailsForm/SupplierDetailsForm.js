import React, { useEffect, useState } from "react";
import moment from "moment";
import "./SupplierDetailsForm.css";
import avt from "assets/images/avt.jpg";
import {
     CameraOutlined,
     CaretUpOutlined,
     DownloadOutlined,
     HighlightOutlined,
     PlusOutlined,
} from "@ant-design/icons";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

import {
     Form,
     Input,
     Button,
     Radio,
     Select,
     Cascader,
     DatePicker,
     InputNumber,
     TreeSelect,
     Switch,
     Checkbox,
     Upload,
     Tag,
     Divider,
     List,
     Typography,
     message,
} from "antd";
import {
     getSupplierDetails,
     createDetails,
     updateDetails,
} from "features/supplier-manager/supplierManager";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { unwrapResult } from "@reduxjs/toolkit";
import queryString from "query-string";
import { getUserName } from "helpers/auth.helpers";
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
     const [form] = Form.useForm();

     const [componentDisabled, setComponentDisabled] = useState(true);
     const [status, setStatus] = useState(null);
     const [birthDay, setBirthDay] = useState(null);

     const defaultValues = {
          status: 0,
          gender: true,
     };
     const initialValues = createMode ? defaultValues : dataDetails;

     const onFormLayoutChange = ({ disabled }) => {
          setComponentDisabled(disabled);
     };

     const onChangeBirthDay = (value, dateString) => {
          setBirthDay(dateString);
     };

     const onFinish = async ({ city, district, ward, ...args }) => {
          if (createMode) {
               const bd =
                    birthDay === null
                         ? moment().utc().format("YYYY-MM-DD")
                         : birthDay;

               dispatch(
                    createDetails({
                         data: {
                              city: city.value,
                              district: district.value,
                              ward: ward.value,
                              ...args,
                              status: 1,
                              birthDay: bd,
                         },
                    })
               )
                    .then(unwrapResult)
                    .then((res) => {
                         console.log(res);
                         message.success("Create details success!");
                    })
                    .catch((error) => {
                         console.log(error);
                         message.error("Username or password not correct");
                         //  dispatch(updateError(CODE_ERROR.ERROR_LOGIN));
                    });
          } else {
               const bd = birthDay === null ? initialValues.birthDay : birthDay;
               const stt = status === null ? initialValues.status : status;

               dispatch(
                    updateDetails({
                         id: dataDetails.id,
                         data: {
                              city:
                                   typeof city === "string" ? city : city.value,
                              district:
                                   typeof district === "string"
                                        ? district
                                        : district.value,
                              ward:
                                   typeof ward === "string" ? ward : ward.value,
                              ...args,
                              status: stt,
                              birthDay: bd,
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
                         //  message.error("Username or password not correct");
                         //  dispatch(updateError(CODE_ERROR.ERROR_LOGIN));
                    });
          }
     };

     useEffect(() => {
          dispatch(getProvinces());
          setComponentDisabled(createMode);
     }, [dispatch]);

     return (
          <div className="details">
               {initialValues !== null && (
                    <>
                         {!createMode && (
                              <div className="details__left">
                              <div className="details__avatar">
                                   <div className="details__avatar-img">
                                        <img src={dataDetails.avatarSupplier} alt="avt" />
                                   </div>

                                   <Form.Item
                                        valuePropName="fileList"
                                        className="item_choose-avt"
                                   >
                                        <Upload
                                             action="/upload.do"
                                             listType="picture-card"
                                        >
                                             <CameraOutlined
                                                  style={{ fontSize: "2rem" }}
                                             />
                                        </Upload>
                                   </Form.Item>
                              </div>

                              <div className="details__fullname">
                                   {`${dataDetails.firstContactName} ${dataDetails.lastContactName}`}
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
                                        <path
                                             stroke="none"
                                             d="M0 0h24v24H0z"
                                             fill="none"
                                        ></path>
                                        <circle cx="12" cy="11" r="3"></circle>
                                        <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z"></path>
                                   </svg>
                                   {`${dataDetails.district}, ${dataDetails.city}`}
                              </div>

                              {dataDetails.status === 1 ? (
                                   <Tag
                                        color="success"
                                        className="details__status"
                                   >
                                        Active
                                   </Tag>
                              ) : (
                                   <Tag
                                        color="error"
                                        className="details__status"
                                   >
                                        Inactive
                                   </Tag>
                              )}
                         </div>
                         )}

                         <div className="details__right">
                              <div className="details__group">
                                   <Form.Item
                                        label="Enable Update"
                                        className="item-sm"
                                   >
                                        <Switch
                                             checked={!componentDisabled}
                                             onChange={(checked, e) =>
                                                  setComponentDisabled(!checked)
                                             }
                                        />
                                   </Form.Item>
                              </div>

                              <Form
                                   form={form}
                                   labelCol={{
                                        span: 4,
                                   }}
                                   wrapperCol={{
                                        span: 14,
                                   }}
                                   layout="horizontal"
                                   onValuesChange={onFormLayoutChange}
                                   disabled={componentDisabled}
                                   name="form"
                                   initialValues={initialValues}
                                   onFinish={onFinish}
                                   colon={false}
                                   >
                                   <Divider />

                                   <div className="details__group">
                                        <div className="details__items">
                                             <Form.Item
                                                  disabled={componentDisabled}
                                             >
                                                  <Button
                                                       type="primary"
                                                       shape="round"
                                                       icon={
                                                            <CaretUpOutlined />
                                                       }
                                                       size={"large"}
                                                       htmlType="submit"
                                                  >
                                                       Update
                                                  </Button>
                                             </Form.Item>
                                             <Form.Item
                                                  disabled={componentDisabled}
                                             >
                                                  <Button
                                                       type="primary"
                                                       shape="round"
                                                       icon={
                                                            <HighlightOutlined />
                                                       }
                                                       size={"large"}
                                                       htmlType="reset"
                                                  >
                                                       Reset
                                                  </Button>
                                             </Form.Item>
                                        </div>
                                   </div>

                                   <div className="details__group">
                                        <Form.Item
                                             name="supplierName"
                                             label={<Text>Supplier Name</Text>}
                                             className="details__item"
                                        >
                                             <Input />
                                        </Form.Item>
                                   </div>
                                   
                                   <div className="details__group">
                                        <Form.Item
                                             name="firstContactName"
                                             label={<Text>First Contact Name</Text>}
                                             className="details__item"
                                        >
                                             <Input />
                                        </Form.Item>
                                        <Form.Item
                                             // name="firstContactName""lastContactName"
                                             name="lastContactName"
                                             label={<Text>Last Contact Name</Text>}
                                             className="details__item"
                                        >
                                             <Input />
                                        </Form.Item>
                                   </div>

                                   <div className="details__group">
                                        <Form.Item
                                             name="bankName"
                                             label={<Text>Bank Name</Text>}
                                             className="details__item"
                                        >
                                             <Input />
                                        </Form.Item>
                                        <Form.Item
                                             name="phoneNumberContact"
                                             label={<Text>Phone Number Contact</Text>}
                                             className="details__item"
                                        >
                                             <Input />
                                        </Form.Item>
                                   </div>

                                   <div className="details__group">
                                        <Form.Item
                                             name="bankAccountNumber"
                                             label={
                                                  <Text>Bank Account Name</Text>
                                             }
                                             className="details__item"
                                        >
                                             <Input />
                                        </Form.Item>

                                        <Form.Item
                                             name="description"
                                             label={
                                                  <Text>Description</Text>
                                             }
                                             className="details__item"
                                        >
                                             <Input />
                                        </Form.Item>
                                   </div>

                                   <div className="details__group">
                                        <Form.Item
                                             name="taxCode"
                                             label={
                                                  <Text>Tax Code</Text>
                                             }
                                             className="details__item"
                                        >
                                             <Input />
                                        </Form.Item>

                                        <Form.Item
                                             name="address"
                                             label={
                                                  <Text>Address</Text>
                                             }
                                             className="details__item"
                                        >
                                             <Input />
                                        </Form.Item>
                                   </div>

                              </Form>
                         </div>
                    </>
               )}
          </div>
     );
}

export default React.memo(SupplierDetailsForm);

// import React, { useEffect, useState } from "react";
// import moment from "moment";
// import "./SupplierDetailsForm.css";
// import avt from "assets/images/avt.jpg";
// import {
//      CameraOutlined,
//      CaretUpOutlined,
//      DownloadOutlined,
//      HighlightOutlined,
//      PlusOutlined,
// } from "@ant-design/icons";
// import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

// import {
//      Form,
//      Input,
//      Button,
//      Radio,
//      Select,
//      Cascader,
//      DatePicker,
//      InputNumber,
//      TreeSelect,
//      Switch,
//      Checkbox,
//      Upload,
//      Tag,
//      Divider,
//      List,
//      Typography,
// } from "antd";
// import { getEmployeeDetails } from "features/employee-manager/employeeManager";
// import { useDispatch, useSelector } from "react-redux";
// import { useHistory, useLocation } from "react-router-dom";
// import { unwrapResult } from "@reduxjs/toolkit";
// import queryString from "query-string";
// import { getUserName } from "helpers/auth.helpers";
// import {
//      getDistrict,
//      getProvince,
//      getProvinces,
// } from "features/provinces/provinces";
// const { RangePicker } = DatePicker;
// const { TextArea } = Input;
// const { Option } = Select;
// const { Paragraph, Text } = Typography;

// function SupplierDetailsForm(props) {
//      const { dataDetails } = useSelector((state) => state.supplier);
//      const { provinces, districts, wards } = useSelector(
//           (state) => state.provinces
//      );

//      const history = useHistory();
//      const location = useLocation();
//      const dispatch = useDispatch();
//      const [form] = Form.useForm();

//      const [componentDisabled, setComponentDisabled] = useState(true);
//      const [status, setStatus] = useState(null);
//      const isCreateMode = props.isEdit;

//      const onFormLayoutChange = ({ disabled }) => {
//           setComponentDisabled(disabled);
//      };

//      const onFinish = async (value) => {
//           console.log(value);
//      };

//      useEffect(() => {
//           dispatch(getProvinces());
//      }, []);
//      const defaultValues = {
//           status: 0,
//           gender: true,
//      };
//      const initialValues = isCreateMode ? defaultValues : dataDetails;
     
//      return (
//           <div className="details">
//                {initialValues !== null && (
//                     <>
//                          <div className="details__left">
//                               <div className="details__avatar">
//                                    <div className="details__avatar-img">
//                                         <img src={dataDetails.avatarSupplier} alt="avt" />
//                                    </div>

//                                    <Form.Item
//                                         valuePropName="fileList"
//                                         className="item_choose-avt"
//                                    >
//                                         <Upload
//                                              action="/upload.do"
//                                              listType="picture-card"
//                                         >
//                                              <CameraOutlined
//                                                   style={{ fontSize: "2rem" }}
//                                              />
//                                         </Upload>
//                                    </Form.Item>
//                               </div>

//                               <div className="details__fullname">
//                                    {`${dataDetails.firstContactName} ${dataDetails.lastContactName}`}
//                               </div>
//                               <div className="details__username">{`@${getUserName()}`}</div>

//                               <div className="details__location">
//                                    <svg
//                                         xmlns="http://www.w3.org/2000/svg"
//                                         className="icon icon-tabler icon-tabler-map-pin"
//                                         width="18"
//                                         height="18"
//                                         viewBox="0 0 24 24"
//                                         strokeWidth="2"
//                                         stroke="currentColor"
//                                         fill="none"
//                                         strokeLinecap="round"
//                                         strokeLinejoin="round"
//                                    >
//                                         <path
//                                              stroke="none"
//                                              d="M0 0h24v24H0z"
//                                              fill="none"
//                                         ></path>
//                                         <circle cx="12" cy="11" r="3"></circle>
//                                         <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z"></path>
//                                    </svg>
//                                    {`${dataDetails.district}, ${dataDetails.city}`}
//                               </div>

//                               {dataDetails.status === 1 ? (
//                                    <Tag
//                                         color="success"
//                                         className="details__status"
//                                    >
//                                         Active
//                                    </Tag>
//                               ) : (
//                                    <Tag
//                                         color="error"
//                                         className="details__status"
//                                    >
//                                         Inactive
//                                    </Tag>
//                               )}
//                          </div>

//                          <div className="details__right">
//                               <div className="details__group">
//                                    <Form.Item
//                                         label="Enable Update"
//                                         className="item-sm"
//                                    >
//                                         <Switch
//                                              checked={!componentDisabled}
//                                              onChange={(checked, e) =>
//                                                   setComponentDisabled(!checked)
//                                              }
//                                         />
//                                    </Form.Item>
//                               </div>

//                               <Form
//                                    form={form}
//                                    labelCol={{
//                                         span: 4,
//                                    }}
//                                    wrapperCol={{
//                                         span: 14,
//                                    }}
//                                    layout="horizontal"
//                                    onValuesChange={onFormLayoutChange}
//                                    disabled={componentDisabled}
//                                    name="form"
//                                    initialValues={initialValues}
//                                    onFinish={onFinish}
//                                    colon={false}
//                               >
//                                    <Divider />

//                                    <div className="details__group">
//                                         <div className="details__items">
//                                              <Form.Item
//                                                   disabled={componentDisabled}
//                                              >
//                                                   <Button
//                                                        type="primary"
//                                                        shape="round"
//                                                        icon={
//                                                             <CaretUpOutlined />
//                                                        }
//                                                        size={"large"}
//                                                        htmlType="submit"
//                                                   >
//                                                        Update
//                                                   </Button>
//                                              </Form.Item>
//                                              <Form.Item
//                                                   disabled={componentDisabled}
//                                              >
//                                                   <Button
//                                                        type="primary"
//                                                        shape="round"
//                                                        icon={
//                                                             <HighlightOutlined />
//                                                        }
//                                                        size={"large"}
//                                                        htmlType="reset"
//                                                   >
//                                                        Reset
//                                                   </Button>
//                                              </Form.Item>
//                                         </div>
//                                    </div>

//                                    <div className="details__group">
//                                         <Form.Item
//                                              name="supplierName"
//                                              label={<Text>Supplier Name</Text>}
//                                              className="details__item"
//                                         >
//                                              <Input />
//                                         </Form.Item>
//                                         <Form.Item
//                                              // name="firstContactName""lastContactName"
//                                              name={`${dataDetails.firstContactName}`}
//                                              label={<Text>Contact Name</Text>}
//                                              className="details__item"
//                                         >
//                                              <Input />
//                                         </Form.Item>
//                                    </div>

//                                    <div className="details__group">
//                                         <Form.Item
//                                              name="bankName"
//                                              label={<Text>Bank Name</Text>}
//                                              className="details__item"
//                                         >
//                                              <Input />
//                                         </Form.Item>
//                                         <Form.Item
//                                              name="phoneNumberContact"
//                                              label={<Text>Phone Number Contact</Text>}
//                                              className="details__item"
//                                         >
//                                              <Input />
//                                         </Form.Item>
//                                    </div>

//                                    <div className="details__group">
//                                         <Form.Item
//                                              name="bankAccountNumber"
//                                              label={
//                                                   <Text>Bank Account Name</Text>
//                                              }
//                                              className="details__item"
//                                         >
//                                              <Input />
//                                         </Form.Item>

//                                         <Form.Item
//                                              name="description"
//                                              label={
//                                                   <Text>Description</Text>
//                                              }
//                                              className="details__item"
//                                         >
//                                              <Input />
//                                         </Form.Item>
//                                    </div>

//                                    <div className="details__group">
//                                         <Form.Item
//                                              name="taxCode"
//                                              label={
//                                                   <Text>Tax Code</Text>
//                                              }
//                                              className="details__item"
//                                         >
//                                              <Input />
//                                         </Form.Item>

//                                         <Form.Item
//                                              name="address"
//                                              label={
//                                                   <Text>Address</Text>
//                                              }
//                                              className="details__item"
//                                         >
//                                              <Input />
//                                         </Form.Item>
//                                    </div>

//                               </Form>
//                          </div>
//                     </>
//                )}
//           </div>
//      );
// }

// export default React.memo(SupplierDetailsForm);
