import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { unwrapResult } from "@reduxjs/toolkit";
import queryString from "query-string";

import { LockOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, notification, Spin } from "antd";

import { getMessage } from "helpers/util.helper";
import { CODE_ERROR } from "constants/errors.constants";
import { MESSAGE_ERROR } from "constants/messages.constants";
import { verifyCode, AuthPaths } from "../../auth";

import "../ForgotPassword/ForgotPassword.css";

export default function VerifyCode() {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    const query = queryString.parse(location.search);

    setLoading(true);

    dispatch(verifyCode({ data: { ...values, ...query } }))
      .then(unwrapResult)
      .then((res) => {
        notification.success({
          message: "Quên mật khẩu",
          description: "Mã Code hợp lệ",
        });
        history.push(AuthPaths.RESET_PASSWORD, { id: query.accountId });
      })
      .catch((error) => {
        notification.error({
          message: "Quên mật khẩu",
          description: "Mã Code không đúng, vui lòng thử lại",
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
        >
          <Form.Item
            name="verifCodes"
            rules={[
              {
                required: true,
                message: getMessage(
                  CODE_ERROR.ERROR_REQUIRED,
                  MESSAGE_ERROR,
                  "Code"
                ),
              },
              {
                len: 6,
                message: getMessage(
                  CODE_ERROR.ERROR_LENGTH,
                  MESSAGE_ERROR,
                  "Code",
                  6
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
