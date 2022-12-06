import React, { useEffect, useState } from "react";
import "./CategoryDetailsForm.css";
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
import { updateDetails } from "features/category-manager/categoryManager";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { unwrapResult } from "@reduxjs/toolkit";

import { CODE_ERROR } from "constants/errors.constants";
import { MESSAGE_ERROR } from "constants/messages.constants";
import { getMessage } from "helpers/util.helper";
const { TextArea } = Input;
const { Option } = Select;
const { Paragraph, Text } = Typography;

function CategoryDetailsForm() {
  const { dataDetails, createMode } = useSelector((state) => state.category);

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
        console.log(res);
        notification.success({
          message: "Chức năg",
          description: "Cập nhật Chức năng thành công",
        });
      })
      .catch((error) => {
        console.log(error);
        console.log(dataDetails.id);
        notification.error({
          message: "Chức năg",
          description: "Cập nhật Chức năng thất bại",
        });
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
              name="categoryName"
              label={<Text>Tên Chức năng</Text>}
              className="details__item"
              rules={[
                {
                  required: true,
                  message: getMessage(
                    CODE_ERROR.ERROR_REQUIRED,
                    MESSAGE_ERROR,
                    "Tên Chức năng"
                  ),
                },
                {
                  pattern:
                    /^[a-zA-Z0-9aAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆ fFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTu UùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ\s]{2,50}$/,
                  message: getMessage(
                    CODE_ERROR.ERROR_NUMBER_LETTER,
                    MESSAGE_ERROR,
                    "Tên Chức năng"
                  ),
                },
                {
                  max: 50,
                  message: getMessage(
                    CODE_ERROR.ERROR_NUMBER_MAX,
                    MESSAGE_ERROR,
                    "Tên Chức năng",
                    50
                  ),
                },
                {
                  min: 2,
                  message: getMessage(
                    CODE_ERROR.ERROR_NUMBER_MIN,
                    MESSAGE_ERROR,
                    "Tên Chức năng",
                    2
                  ),
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="description"
              label={<Text>Mô tả</Text>}
              className="details__item"
              // rules={[
              //   {
              //     required: true,
              //     message: getMessage(
              //       CODE_ERROR.ERROR_REQUIRED,
              //       MESSAGE_ERROR,
              //       "Supplier Id"
              //     ),
              //   },
              // ]}
            >
              <Input />
            </Form.Item>
          </div>
          <div className="details__group">
            <Form.Item label={<Text>Trạng thái</Text>} className="details__item">
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

export default React.memo(CategoryDetailsForm);
