import React, { useEffect, useState } from "react";
import moment from "moment";
import "./EmployeeDetailsForm.css";
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
} from "antd";
import { getEmployeeDetails } from "features/employee-manager/employeeManager";
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
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Option } = Select;
const { Paragraph, Text } = Typography;

function EmployeeDetailsForm(props) {
     const { dataDetails } = useSelector((state) => state.employee);
     const { provinces, districts, wards } = useSelector(
          (state) => state.provinces
     );

     const history = useHistory();
     const location = useLocation();
     const dispatch = useDispatch();
     const [form] = Form.useForm();

     const [componentDisabled, setComponentDisabled] = useState(true);
     const [status, setStatus] = useState(null);
     const isCreateMode = props.isEdit;

     const onFormLayoutChange = ({ disabled }) => {
          setComponentDisabled(disabled);
     };

     const onFinish = async (value) => {
          console.log(value);
     };
		 
     useEffect(() => {
          dispatch(getProvinces());
     }, []);
		 
     const defaultValues = {
          status: 0,
          gender: true,
     };
     const initialValues = isCreateMode ? defaultValues : dataDetails;
     return (
          <div className="details">
               {initialValues !== null && (
                    <>
                         <div className="details__left">
                              <div className="details__avatar">
                                   <div className="details__avatar-img">
                                        <img src={avt} alt="avt" />
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
                                   {`${dataDetails.firstName} ${dataDetails.lastName}`}
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
                                             name="idNumber"
                                             label={<Text>Number ID</Text>}
                                             className="details__item"
                                        >
                                             <Input />
                                        </Form.Item>
                                        <Form.Item
                                             label={<Text>Status</Text>}
                                             className="details__item"
                                        >
                                             <Switch
                                                  checked={
                                                       status === null
                                                            ? initialValues.status
                                                            : status
                                                  }
                                                  onChange={(checked) =>
                                                       setStatus(checked)
                                                  }
                                             />
                                        </Form.Item>
                                   </div>

                                   <div className="details__group">
                                        <Form.Item
                                             name="firstName"
                                             label={<Text>Firstname</Text>}
                                             className="details__item"
                                        >
                                             <Input />
                                        </Form.Item>
                                        <Form.Item
                                             name="lastName"
                                             label={<Text>Lastname</Text>}
                                             className="details__item"
                                        >
                                             <Input />
                                        </Form.Item>
                                   </div>

                                   <div className="details__group">
                                        <Form.Item
                                             name="email"
                                             label={<Text>Email</Text>}
                                             className="details__item"
                                        >
                                             <Input />
                                        </Form.Item>
                                        <Form.Item
                                             name="phoneNumber"
                                             label={<Text>Phone</Text>}
                                             className="details__item"
                                        >
                                             <Input />
                                        </Form.Item>
                                   </div>

                                   <div className="details__group">
                                        <Form.Item
                                             name="apartmentNumber"
                                             label={
                                                  <Text>Apartment Number</Text>
                                             }
                                             className="details__item"
                                        >
                                             <Input />
                                        </Form.Item>

                                        <Form.Item
                                             name="gender"
                                             label={<Text>Gender</Text>}
                                             className="details__item"
                                        >
                                             <Radio.Group>
                                                  <Radio value={true}>
                                                       Male
                                                  </Radio>
                                                  <Radio value={false}>
                                                       Female
                                                  </Radio>
                                             </Radio.Group>
                                        </Form.Item>
                                   </div>

                                   <div className="details__group">
                                        <Form.Item
                                             name="city"
                                             label={<Text>City</Text>}
                                             className="details__item"
                                        >
                                             <Select
                                                  labelInValue
                                                  showSearch
                                                  style={{
                                                       width: 200,
                                                  }}
                                                  onChange={(value) => {
                                                       dispatch(
                                                            getProvince(
                                                                 value.key
                                                            )
                                                       );
                                                  }}
                                                  placeholder="Search to Select"
                                                  optionFilterProp="children"
                                                  filterOption={(
                                                       input,
                                                       option
                                                  ) =>
                                                       option.children.includes(
                                                            input
                                                       )
                                                  }
                                                  filterSort={(
                                                       optionA,
                                                       optionB
                                                  ) =>
                                                       optionA.children
                                                            .toLowerCase()
                                                            .localeCompare(
                                                                 optionB.children.toLowerCase()
                                                            )
                                                  }
                                             >
                                                  {provinces?.map((p) => {
                                                       return (
                                                            <Option
                                                                 value={p.name}
                                                                 key={p.code}
                                                            >
                                                                 {`${p.name}`}
                                                            </Option>
                                                       );
                                                  })}
                                             </Select>
                                        </Form.Item>

                                        <Form.Item
                                             label={<Text>Date of birth</Text>}
                                             className="details__item"
                                        >
                                             <DatePicker
                                                  defaultValue={moment(
                                                       dataDetails.birthDay,
                                                       "YYYY-MM-DD"
                                                  )}
                                             />
                                        </Form.Item>
                                   </div>
                                   <div className="details__group">
                                        <Form.Item
                                             name="district"
                                             label={<Text>District</Text>}
                                             className="details__item"
                                        >
                                             <Select
                                                  labelInValue
                                                  showSearch
                                                  style={{
                                                       width: 200,
                                                  }}
                                                  onChange={(value, e) => {
                                                       dispatch(
                                                            getDistrict(
                                                                 value.key
                                                            )
                                                       );
                                                  }}
                                                  placeholder="Search to Select"
                                                  optionFilterProp="children"
                                                  filterOption={(
                                                       input,
                                                       option
                                                  ) =>
                                                       option.children.includes(
                                                            input
                                                       )
                                                  }
                                                  filterSort={(
                                                       optionA,
                                                       optionB
                                                  ) =>
                                                       optionA.children
                                                            .toLowerCase()
                                                            .localeCompare(
                                                                 optionB.children.toLowerCase()
                                                            )
                                                  }
                                             >
                                                  {districts?.map((d) => {
                                                       return (
                                                            <Option
                                                                 value={d.name}
                                                                 key={d.code}
                                                            >
                                                                 {`${d.name}`}
                                                            </Option>
                                                       );
                                                  })}
                                             </Select>
                                        </Form.Item>

                                        <Form.Item
                                             name="ward"
                                             label={<Text>Ward</Text>}
                                             className="details__item"
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
                                                  filterOption={(
                                                       input,
                                                       option
                                                  ) =>
                                                       option.children.includes(
                                                            input
                                                       )
                                                  }
                                                  filterSort={(
                                                       optionA,
                                                       optionB
                                                  ) =>
                                                       optionA.children
                                                            .toLowerCase()
                                                            .localeCompare(
                                                                 optionB.children.toLowerCase()
                                                            )
                                                  }
                                             >
                                                  {wards?.map((w) => {
                                                       return (
                                                            <Option
                                                                 value={w.name}
                                                                 key={w.code}
                                                            >
                                                                 {`${w.name}`}
                                                            </Option>
                                                       );
                                                  })}
                                             </Select>
                                        </Form.Item>
                                   </div>
                              </Form>
                         </div>
                    </>
               )}
          </div>
     );
}

export default React.memo(EmployeeDetailsForm);
