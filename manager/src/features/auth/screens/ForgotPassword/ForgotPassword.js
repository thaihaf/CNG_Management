import React, { useEffect, useState } from "react";
import cx from "classnames";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { unwrapResult } from "@reduxjs/toolkit";

import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, notification, Spin } from "antd";

import { getMessage } from "helpers/util.helper";
import { CODE_ERROR } from "constants/errors.constants";
import { MESSAGE_ERROR } from "constants/messages.constants";
import { forgotPassword, updateError, AuthPaths } from "../../auth";

import "./ForgotPassword.css";
import { LoadingSpinner } from "components";

export default function ForgotPassword() {
  const dispatch = useDispatch();
  const history = useHistory();

  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    setLoading(true);

    dispatch(forgotPassword({ data: values }))
      .then(unwrapResult)
      .then((res) => {
        notification.success({
          message: "Quên mật khẩu",
          description: "Lấy mã thành công, vui lòng kiểm tra Mã trong email",
        });
        history.push(AuthPaths.LOGIN);
      })
      .catch((error) => {
        notification.error({
          message: "Quên mật khẩu",
          description: "Không tìm thấy Email",
        });
        setLoading(false);
        dispatch(updateError(CODE_ERROR.ERROR_LOGIN));
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
        >
          <Form.Item
            name="email"
            rules={[
              {
                required: true,
                message: getMessage(
                  CODE_ERROR.ERROR_REQUIRED,
                  MESSAGE_ERROR,
                  "Email"
                ),
              },
              {
                type: "email",
                message: getMessage(
                  CODE_ERROR.ERROR_EMAIL,
                  MESSAGE_ERROR,
                  "Email"
                ),
              },
            ]}
            className="form_item"
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="email@gmail.com"
              className="login_input"
            />
          </Form.Item>

          <Form.Item className="form_item">
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button= btn_signUp"
            >
              Lấy mã
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Spin>
  );
}
