import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { unwrapResult } from "@reduxjs/toolkit";
import queryString from "query-string";

import { LockOutlined } from "@ant-design/icons";
import { Button, Form, Input, notification, Typography } from "antd";

import { getMessage } from "helpers/util.helper";
import { CODE_ERROR } from "constants/errors.constants";
import { MESSAGE_ERROR } from "constants/messages.constants";
import { resetPassword, AuthPaths } from "../../auth";

import "../LoginScreen/LoginScreen.css";
import { motion } from "framer-motion/dist/framer-motion";
import confirmEmailImg from "assets/icons/confirmEmail.png";
const { Title } = Typography;

export default function ResetPassword() {
  const dispatch = useDispatch();
  const location = useLocation();
  const history = useHistory();

  const [loading, setLoading] = useState(false);
  const query = queryString.parse(location.search);

  const onFinish = (values) => {
    setLoading(true);

    dispatch(resetPassword({ data: { id: parseInt(query.id), ...values } }))
      .then(unwrapResult)
      .then((res) => {
        notification.success({
          message: "Mật khẩu mới",
          description: "Thay đổi mật khẩu thành công",
        });
        // history.push(AuthPaths.LOGIN);
      })
      .catch((error) => {
        notification.error({
          message: "Mật khẩu mới",
          description: error?.Error?.message || "Lỗi rồi!!!",
        });
        setLoading(false);
      });
  };

  return (
    <Form name="reset" className="login" onFinish={onFinish} layout="vertical">
      <motion.div
        className="form"
        animate={{ opacity: [0, 1], x: [-50, 0] }}
        exit={{ opacity: [1, 0] }}
        transition={{ duration: 1 }}
      >
        {/* <div className="action" onClick={() => history.push(AuthPaths.LOGIN)}>
          <img src={leftArrowImg} alt="back" />
        </div> */}

        <div className="top">
          <img src={confirmEmailImg} alt="" />
          <Title level={1}>Mật khẩu mới</Title>
        </div>

        <Form.Item
          name="newPassword"
          label="Mật khẩu"
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
          name="confirmNewPassword"
          label="Xác nhận mật khẩu"
          rules={[
            {
              required: true,
              message: getMessage(
                CODE_ERROR.ERROR_REQUIRED,
                MESSAGE_ERROR,
                "Mật khẩu mới"
              ),
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("newPassword") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error("Mật khẩu không trùng khớp"));
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
            loading={loading}
          >
            Xác nhận
          </Button>
        </Form.Item>
      </motion.div>
    </Form>
  );
}
