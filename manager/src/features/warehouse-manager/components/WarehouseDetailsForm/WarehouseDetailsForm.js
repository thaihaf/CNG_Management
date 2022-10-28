import React, { useEffect, useState } from "react";
import "./WarehouseDetailsForm.css";
import { CaretUpOutlined, HighlightOutlined } from "@ant-design/icons";
import {
  Form,
  Input,
  Button,
  Select,
  Switch,
  Divider,
  Typography,
  message,
  Spin,
} from "antd";
import { updateDetails } from "features/warehouse-manager/warehouseManager";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { unwrapResult } from "@reduxjs/toolkit";
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

function WarehouseDetailsForm() {
  const { dataDetails, createMode } = useSelector((state) => state.warehouse);
  const { provinces, districts, wards } = useSelector(
    (state) => state.provinces
  );

  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const [formWarehouse] = Form.useForm();

  const [isLoading, setIsLoading] = useState(false);
  const [imgURL, setImgUrl] = useState(null);
  const [status, setStatus] = useState(null);
  const [birthDay, setBirthDay] = useState(null);

  const initialValues = dataDetails ? dataDetails : {};

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
      });
  };

  useEffect(() => {
    formWarehouse.setFieldsValue(initialValues);
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
        <div className="details__right">
          <Form
            form={formWarehouse}
            layout="horizontal"
            name="form"
            initialValues={initialValues}
            onFinish={onFinishUpdate}
            colon={false}
          >
            <div className="details__group">
              <Form.Item
                name="warehouseName"
                label={<Text>Warehouse Name</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "Warehouse Name"
                    ),
                  },
                  {
                    max: 25,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MAX,
                      MESSAGE_ERROR,
                      "Warehouse Name",
                      25
                    ),
                  },
                  {
                    min: 2,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MIN,
                      MESSAGE_ERROR,
                      "Warehouse Name",
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
                name="noteWarehouse"
                label={<Text>Note Warehouse</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "Note Warehouse"
                    ),
                  },
                  {
                    max: 25,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MAX,
                      MESSAGE_ERROR,
                      "Note Warehouse",
                      25
                    ),
                  },
                  {
                    min: 2,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MIN,
                      MESSAGE_ERROR,
                      "Note Warehouse",
                      2
                    ),
                  },
                ]}
              >
                <Input />
              </Form.Item>
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

export default React.memo(WarehouseDetailsForm);
