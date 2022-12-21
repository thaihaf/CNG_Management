import React, { useEffect, useState } from "react";
import cx from "classnames";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { unwrapResult } from "@reduxjs/toolkit";

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
import { forgotPassword, updateError, AuthPaths } from "../../auth";

import "../LoginScreen/LoginScreen.css";
import { LoadingSpinner } from "components";
import { motion } from "framer-motion/dist/framer-motion";

import emailImg from "assets/icons/email.png";
import leftArrowImg from "assets/icons/leftArrow.png";

const { Title } = Typography;

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
          message: "Tìm lại mật khẩu",
          description: "Lấy mã thành công, vui lòng kiểm tra trong email",
        });
        history.push(AuthPaths.LOGIN);
      })
      .catch((error) => {
        notification.error({
          message: "Tìm lại mật khẩu",
          description: error?.Error?.message || "Lỗi rồi!!!",
        });
        setLoading(false);
        dispatch(updateError(CODE_ERROR.ERROR_LOGIN));
      });
  };

  return (
    <motion.div
      className="login"
      animate={{ opacity: [0, 1], x: [-50, 0] }}
      exit={{ opacity: [1, 0] }}
      transition={{ duration: 1 }}
    >
      <Form
        name="forgot"
        className="form"
        onFinish={onFinish}
        layout="vertical"
      >
        <div className="action" onClick={() => history.push(AuthPaths.LOGIN)}>
          <img src={leftArrowImg} alt="back" />
        </div>

        <div className="top">
          <img src={emailImg} alt="" />
          <Title level={1}>Tìm lại mật khẩu</Title>
          <p style={{ color: "gray", fontSize: "1.3rem" }}>
            Nhập email để lấy lại mật khẩu
          </p>
        </div>

        <Form.Item
          name="email"
          label="Địa chỉ email"
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
            loading={loading}
          >
            Lấy mã
          </Button>
        </Form.Item>
      </Form>
    </motion.div>
  );
}
