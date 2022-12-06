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
  notification,
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
        notification.success({
          message: "Kho",
          description: "Cập nhật Kho thành công",
        });
      })
      .catch((error) => {
        console.log(error);
        console.log(dataDetails.id);
        notification.error({
          message: "Kho",
          description: "Cập nhật Kho thất bại",
        });
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
                label={<Text>Tên kho</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "Tên kho"
                    ),
                  },
                  {
                    pattern:
                      /^[a-zA-Z0-9aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆ fFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTu UùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ\s]{2,50}$/,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_LETTER,
                      MESSAGE_ERROR,
                      "Tên kho"
                    ),
                  },
                  {
                    max: 50,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MAX,
                      MESSAGE_ERROR,
                      "Tên kho",
                      50
                    ),
                  },
                  {
                    min: 2,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MIN,
                      MESSAGE_ERROR,
                      "Tên kho",
                      2
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
                  checked={status === null ? initialValues.status : status}
                  onChange={(checked) => setStatus(checked)}
                  disabled={false}
                />
              </Form.Item>
            </div>

            <div className="details__group">
              <Form.Item
                name="noteWarehouse"
                label={<Text>Ghi chú</Text>}
                className="details__item"
                rules={[
                  {
                    required: true,
                    message: getMessage(
                      CODE_ERROR.ERROR_REQUIRED,
                      MESSAGE_ERROR,
                      "Ghi chú"
                    ),
                  },
                  {
                    max: 25,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MAX,
                      MESSAGE_ERROR,
                      "Ghi chú",
                      25
                    ),
                  },
                  {
                    min: 2,
                    message: getMessage(
                      CODE_ERROR.ERROR_NUMBER_MIN,
                      MESSAGE_ERROR,
                      "Ghi chú",
                      2
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
            </div>

            <div className="details__group">
              <Form.Item
                name={["addressDTO", "apartmentNumber"]}
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
                name={["addressDTO", "city"]}
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
            </div>

            <div className="details__group">
              <Form.Item
                name={["addressDTO", "district"]}
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
                name={["addressDTO", "ward"]}
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
                  Cập nhật
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
                  Đặt lại
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
