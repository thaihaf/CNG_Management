import React, { useEffect, useState } from "react";
import "./BrandDetailsForm.css";
import {
  CaretUpOutlined,
  HighlightOutlined,
} from "@ant-design/icons";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

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
} from "antd";
import {
  updateDetails,
} from "features/brand-manager/brandManager";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { unwrapResult } from "@reduxjs/toolkit";
import { getUserName } from "helpers/auth.helpers";
import { CODE_ERROR } from "constants/errors.constants";
import { MESSAGE_ERROR } from "constants/messages.constants";
import { getMessage } from "helpers/util.helper";
const { TextArea } = Input;
const { Option } = Select;
const { Paragraph, Text } = Typography;

function BrandDetailsForm() {
  const { dataDetails, createMode } = useSelector((state) => state.brand);
  const { listSuppliers } = useSelector((state) => state.supplier);

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
    console.log('search:', value);
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
              label={<Text>Brand Name</Text>}
              className="details__item"
              rules={[
                {
                  required: true,
                  message: getMessage(
                    CODE_ERROR.ERROR_REQUIRED,
                    MESSAGE_ERROR,
                    "Brand Name"
                  ),
                },
                {
                  max: 25,
                  message: getMessage(
                    CODE_ERROR.ERROR_NUMBER_MAX,
                    MESSAGE_ERROR,
                    "Brand Name",
                    25
                  ),
                },
                {
                  min: 2,
                  message: getMessage(
                    CODE_ERROR.ERROR_NUMBER_MIN,
                    MESSAGE_ERROR,
                    "Brand Name",
                    2
                  ),
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              name="supplierId"
              label={<Text>Supplier Name</Text>}
              className="details__item"
              rules={[
                {
                  required: true,
                  message: getMessage(
                    CODE_ERROR.ERROR_REQUIRED,
                    MESSAGE_ERROR,
                    "Supplier Id"
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
                      option.children
                        .toLowerCase()
                        .includes(input.toLowerCase())
                    }
                  >
                    {listSuppliers.map((s) => (
                      <Option value={s.id} key={s.id}>
                        {s.supplierName}
                      </Option>
                    ))}
                  </Select>
            </Form.Item>
          </div>
          <div className="details__group">
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

export default React.memo(BrandDetailsForm);
