import React, { useEffect, useState } from "react";
import moment from "moment";
import "./CategoryDetailsForm.css";
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
  Spin,
  Typography,
  message,
} from "antd";
import {
  getCategoryDetails,
  createDetails,
  updateDetails,
} from "features/category-manager/categoryManager";
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
              label={<Text>Category Name</Text>}
              className="details__item"
              rules={[
                {
                  required: true,
                  message: getMessage(
                    CODE_ERROR.ERROR_REQUIRED,
                    MESSAGE_ERROR,
                    "Category Name"
                  ),
                },
                {
                  max: 25,
                  message: getMessage(
                    CODE_ERROR.ERROR_NUMBER_MAX,
                    MESSAGE_ERROR,
                    "Category Name",
                    25
                  ),
                },
                {
                  min: 2,
                  message: getMessage(
                    CODE_ERROR.ERROR_NUMBER_MIN,
                    MESSAGE_ERROR,
                    "Category Name",
                    2
                  ),
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="description"
              label={<Text>Description</Text>}
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
            <Form.Item
              label={<Text>Status</Text>}
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

export default React.memo(CategoryDetailsForm);
