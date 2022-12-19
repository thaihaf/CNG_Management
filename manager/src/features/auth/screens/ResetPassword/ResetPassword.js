import React, { useEffect, useState } from "react";
import cx from "classnames";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { unwrapResult } from "@reduxjs/toolkit";
import queryString from "query-string";

import { LockOutlined, UserOutlined } from "@ant-design/icons";
import {
  Button,
  Form,
  Input,
  message,
  notification,
  Spin,
  Typography,
} from "antd";

import { getMessage } from "helpers/util.helper";
import { CODE_ERROR } from "constants/errors.constants";
import { MESSAGE_ERROR } from "constants/messages.constants";
import { resetPassword, AuthPaths } from "../../auth";

import "../LoginScreen/LoginScreen.css";
import { LoadingSpinner } from "components";

import userProfileImg from "assets/icons/userProfile.png";
const { Title } = Typography;

export default function ResetPassword() {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();

  const [loading, setLoading] = useState(false);

  console.log(location);

  const onFinish = (values) => {
    setLoading(true);
    console.log(values);

    dispatch(resetPassword({ data: { id: location.state.id, ...values } }))
      .then(unwrapResult)
      .then((res) => {
        notification.success({
          message: "Quên mật khẩu",
          description: "Thay đổi mật khẩu thành công",
        });
        history.push(AuthPaths.LOGIN);
      })
      .catch((error) => {
        notification.error({
          message: "Quên mật khẩu",
          description: error?.Error?.message || "Lỗi rồi!!!",
        });
        setLoading(false);
      });
  };

  return (
    <Spin spinning={loading}>
      <div className="login">
        <Form
          name="login"
          className="form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          layout="vertical"
        >
          <div className="top">
            <img src={userProfileImg} alt="" />
            <Title level={1}>Lấy lại mật khẩu</Title>
          </div>

          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[
              {
                required: true,
                message: getMessage(
                  CODE_ERROR.ERROR_REQUIRED,
                  MESSAGE_ERROR,
                  "Mật khẩu mới"
                ),
              },
              //  {
              //    pattern:
              //      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,25}$/,
              //    message: getMessage(
              //      CODE_ERROR.ERROR_FORMAT_PASSWORD,
              //      MESSAGE_ERROR,
              //      "Mật khẩu"
              //    ),
              //  },
              {
                max: 25,
                message: getMessage(
                  CODE_ERROR.ERROR_NUMBER_MAX,
                  MESSAGE_ERROR,
                  "Mật khẩu mới",
                  25
                ),
              },
              {
                min: 8,
                message: getMessage(
                  CODE_ERROR.ERROR_NUMBER_MIN,
                  MESSAGE_ERROR,
                  "Mật khẩu mới",
                  8
                ),
              },
            ]}
            className="form_item"
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="●●●●●●●●●"
              className="login_input"
            />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="Mật khẩu xác nhận"
            rules={[
              {
                required: true,
                message: getMessage(
                  CODE_ERROR.ERROR_REQUIRED,
                  MESSAGE_ERROR,
                  "Mật khẩu xác nhận"
                ),
              },
              {
                max: 25,
                message: getMessage(
                  CODE_ERROR.ERROR_NUMBER_MAX,
                  MESSAGE_ERROR,
                  "Mật khẩu xác nhận",
                  25
                ),
              },
              {
                min: 8,
                message: getMessage(
                  CODE_ERROR.ERROR_NUMBER_MIN,
                  MESSAGE_ERROR,
                  "Mật khẩu xác nhận",
                  8
                ),
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("newPassword") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error(
                      "Mật khẩu xác nhận và Mật khẩu mới phải giống nhau"
                    )
                  );
                },
              }),
            ]}
            className="form_item"
          >
            <Input.Password
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder="●●●●●●●●●"
              className="login_input"
            />
          </Form.Item>

          <Form.Item className="form_item">
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button= btn_signUp"
            >
              Xác nhận
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Spin>
  );
}
