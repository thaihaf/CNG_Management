import React, { useEffect, useState } from "react";
import "./BrandDetailsForm.css";
import { CaretUpOutlined, HighlightOutlined } from "@ant-design/icons";
import {
  Form,
  Input,
  Button,
  Select,
  Switch,
  Divider,
  Spin,
  Typography,
  message,
  notification,
} from "antd";
import { updateDetails } from "features/brand-manager/brandManager";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { unwrapResult } from "@reduxjs/toolkit";
import { CODE_ERROR } from "constants/errors.constants";
import { MESSAGE_ERROR } from "constants/messages.constants";
import { getMessage } from "helpers/util.helper";
const { TextArea } = Input;
const { Option } = Select;
const { Paragraph, Text } = Typography;

function BrandDetailsForm() {
  const { dataDetails, createMode } = useSelector((state) => state.brand);
  const { listSuppliers } = useSelector((state) => state.supplier);
  const { listActiveSuppliers } = useSelector((state) => state.supplier);
  const history = useHistory();
  const location = useLocation();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const [componentDisabled, setComponentDisabled] = useState(true);
  const [status, setStatus] = useState(null);

  const defaultValues = {
    status: 0,
    gender: true,
  };
  const initialValues = createMode ? defaultValues : dataDetails;

  const onFinishUpdate = async ({ ...args }) => {
    dispatch(
      updateDetails({
        id: dataDetails.id,
        data: {
          ...args,
          status: 1,
        },
      })
    )
      .then(unwrapResult)
      .then((res) => {
        notification.success({
          message: "Nhãn hàng",
          description: "Cập nhật thông tin Nhãn hàng thành công",
        });
      })
      .catch((error) => {
        console.log(error);
        console.log(dataDetails.id);
        notification.error({
          message: "Nhãn hàng",
          description: "Cập nhật thông tin Nhãn hàng thất bại",
        });
      });
  };

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [dispatch, createMode, initialValues]);

  if (!initialValues) {
    return <Spin spinning={true} />;
  }

  const onChange = (value) => {
    console.log(`selected ${value}`);
  };
  const onSearch = (value) => {
    console.log("search:", value);
  };

  return (
    <div className="details">
      <div className="details__right">
        <Form
          form={form}
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 14,
          }}
          layout="horizontal"
          name="form"
          initialValues={initialValues}
          onFinish={onFinishUpdate}
          colon={false}
        >
          <div className="details__group">
            <Form.Item
              name="brandName"
              label={<Text>Tên Nhãn Hàng</Text>}
              className="details__item"
              rules={[
                {
                  required: true,
                  message: getMessage(
                    CODE_ERROR.ERROR_REQUIRED,
                    MESSAGE_ERROR,
                    "Tên Nhãn Hàng"
                  ),
                },
                {
                  pattern:
                  /^[a-zA-ZaAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆ fFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTu UùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ\s]{2,50}$/,
                  message: getMessage(
                    CODE_ERROR.ERROR_NUMBER_LETTER,
                    MESSAGE_ERROR,
                    "Tên Nhãn Hàng"
                  ),
                },
                {
                  max: 25,
                  message: getMessage(
                    CODE_ERROR.ERROR_NUMBER_MAX,
                    MESSAGE_ERROR,
                    "Tên Nhãn Hàng",
                    25
                  ),
                },
                {
                  min: 2,
                  message: getMessage(
                    CODE_ERROR.ERROR_NUMBER_MIN,
                    MESSAGE_ERROR,
                    "Tên Nhãn Hàng",
                    2
                  ),
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="supplierId"
              label={<Text>Tên Nhà cung cấp</Text>}
              className="details__item"
              rules={[
                {
                  required: true,
                  message: getMessage(
                    CODE_ERROR.ERROR_REQUIRED,
                    MESSAGE_ERROR,
                    "Nhà cung cấp"
                  ),
                },
              ]}
            >
              <Select
                showSearch
                optionFilterProp="children"
                onChange={onChange}
                onSearch={onSearch}
                filterOption={(input, option) =>
                  option.children.toLowerCase().includes(input.toLowerCase())
                }
              >
                {listActiveSuppliers.map((s) => (
                  <Option value={s.id} key={s.id} id={s.id}>
                    {s.supplierName}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </div>
          <div className="details__group">
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

          <Divider />

          <div className="details__group">
            <Form.Item className="details__items">
              <Button
                type="primary"
                shape="round"
                icon={<CaretUpOutlined />}
                size={"large"}
                htmlType="submit"
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
              >
                Đặt lại
              </Button>
            </Form.Item>
          </div>
        </Form>
      </div>
    </div>
  );
}

export default React.memo(BrandDetailsForm);
