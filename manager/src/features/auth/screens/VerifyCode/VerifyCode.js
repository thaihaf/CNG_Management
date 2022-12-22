import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { unwrapResult } from "@reduxjs/toolkit";
import queryString from "query-string";

import { LockOutlined } from "@ant-design/icons";
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
import { verifyCode, AuthPaths } from "../../auth";
import { motion } from "framer-motion/dist/framer-motion";

import "../LoginScreen/LoginScreen.css";
import leftArrowImg from "assets/icons/leftArrow.png";
import emailImg from "assets/icons/email.png";
const { Title } = Typography;

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
        setLoading(false);
        notification.success({
          message: "Tìm lại mật khẩu",
          description: "Mã Code hợp lệ",
        });
        history.push(AuthPaths.RESET_PASSWORD, { id: query.accountId });
      })
      .catch((error) => {
        setLoading(false);
        notification.error({
          message: "Tìm lại mật khẩu",
          description: error?.Error?.message || "Lỗi rồi!!!",
        });
      });
  };

  return (
    <Form name="verify" className="login" onFinish={onFinish} layout="vertical">
      <motion.div
        className="form"
        animate={{ opacity: [0, 1], x: [-50, 0] }}
        exit={{ opacity: [1, 0] }}
        transition={{ duration: 1 }}
      >
        <div
          className="action"
          onClick={() => history.push(AuthPaths.FORGOT_PASS)}
        >
          <img src={leftArrowImg} alt="back" />
        </div>

        <div className="top">
          <img src={emailImg} alt="" />
          <Title level={1}>Tìm lại mật khẩu</Title>
          <p style={{ color: "gray", fontSize: "1.3rem" }}>
            Nhập mã OTP đã được gửi đến email
          </p>
        </div>

        <Form.Item
          name="verifCodes"
          label="Mã code"
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
            loading={loading}
          >
            Xác nhận
          </Button>
        </Form.Item>
      </motion.div>
    </Form>
  );
}
