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
  UserOutlined,
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
  Spin,
  Avatar,
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

  const [status, setStatus] = useState(null);
  const [birthDay, setBirthDay] = useState(null);

  const defaultValues = {
    status: 0,
    gender: true,
  };
  const initialValues = createMode ? defaultValues : dataDetails;

  const onFinishUpdate = async ({
    apartmentNumber,
    city,
    district,
    ward,
    ...args
  }) => {
    dispatch(
      updateDetails({
        id: dataDetails.id,
        data: {
          address: {
            city:
              typeof city === "string" ? city : city.value,
            district:
              typeof district === "string"
                   ? district
                   : district.value,
            ward:
              typeof ward === "string" ? ward : ward.value,
            apartmentNumber: apartmentNumber,
         },
          ...args,
          status: 1,
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
    form.setFieldsValue(initialValues);
  }, [dispatch, createMode, initialValues]);

  if (!initialValues) {
    return <Spin spinning={true} />;
  }

  return (
    <div className="details">
      <div className="details__left">
        <div className="details__avatar">
          <div className="details__avatar-img">
            <img src={dataDetails.avatarSupplier} alt="avt" />
          </div>

          <Form.Item valuePropName="fileList" className="item_choose-avt">
            <Upload action="/upload.do" listType="picture-card">
              <CameraOutlined style={{ fontSize: "2rem" }} />
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
            <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
            <circle cx="12" cy="11" r="3"></circle>
            <path d="M17.657 16.657l-4.243 4.243a2 2 0 0 1 -2.827 0l-4.244 -4.243a8 8 0 1 1 11.314 0z"></path>
          </svg>
          {`${dataDetails.address.district}, ${dataDetails.address.city}`}
        </div>

        {dataDetails.status === 1 ? (
          <Tag color="success" className="details__status">
            Active
          </Tag>
        ) : (
          <Tag color="error" className="details__status">
            Inactive
          </Tag>
        )}
      </div>

      <div className="details__right">
        <Form
          form={form}
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
              label={<Text>Bank Account Name</Text>}
              className="details__item"
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="avatarSupplier"
              label={<Text>Avatar Supplier</Text>}
              className="details__item"
              rules={[
                {
                  required: true,
                  message: getMessage(
                    CODE_ERROR.ERROR_REQUIRED,
                    MESSAGE_ERROR,
                    "avatarSupplier"
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
              name="apartmentNumber"
              label={<Text>Street</Text>}
              className="details__item"
            >
              <Input defaultValue={initialValues.address?.apartmentNumber} />
            </Form.Item>

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
                defaultValue={initialValues.address?.city}
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
                defaultValue={initialValues.address?.district}
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
              label={<Text>Ward</Text>}
              className="details__item"
            >
              <Select
                labelInValue
                showSearch
                style={{
                  width: 200,
                }}
                defaultValue={initialValues.address?.ward}
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
  );
}

export default React.memo(SupplierDetailsForm);
