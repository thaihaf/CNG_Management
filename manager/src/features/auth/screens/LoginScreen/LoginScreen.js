import React, { useEffect, useState } from "react";
import cx from "classnames";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { unwrapResult } from "@reduxjs/toolkit";

import { LockOutlined, UserOutlined } from "@ant-design/icons";
import {
  Alert,
  Button,
  Checkbox,
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
import {
  updateAccessToken,
  postLogin,
  updateError,
  updateUserName,
} from "../../auth";
import { EmployeeManagerPaths } from "features/employee-manager/employeeManager";

import loginImage from "assets/images/loginImage.png";

import "./LoginScreen.css";
import { getIsLogin } from "helpers/auth.helpers";
import { LoadingSpinner } from "components";
import { SupplierManagerPaths } from "features/supplier-manager/supplierManager";

import userProfileImg from "assets/icons/userProfile.png";
import { ProductManagerPaths } from "features/product-manager/productManager";
const { Title } = Typography;

export default function LoginScreen() {
  const dispatch = useDispatch();
  const { errorLogin, role } = useSelector((state) => state.auth);
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const isLogin = getIsLogin();
    if (isLogin === true) {
      history.push(EmployeeManagerPaths.EMPLOYEE_LIST);
    }
  });

  const onFinish = (values) => {
    const { username, password } = values;
    const authenticationData = {
      username,
      password,
    };

    setLoading(true);

    dispatch(postLogin({ data: authenticationData }))
      .then(unwrapResult)
      .then((res) => {
        notification.success({
          message: "Đăng nhập",
          description: "Đăng nhập thành công!",
        });

        switch (res.role.substring(1, res.role.length - 1)) {
          case "ROLE_ADMIN":
            history.push(ProductManagerPaths.PRODUCT_MANAGER);
            break;
          case "ROLE_EMPLOYEE":
            history.push(SupplierManagerPaths.SUPPLIER_LIST);
            break;
        }
      })
      .catch((error) => {
        console.log(error);
        notification.error({
          message: "Đăng nhập",
          description:
            "Đăng nhập thất bại, vui lòng kiểm tra lại Tài khoản hoặc Mật khẩu",
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
          layout="vertical"
        >
          <div className="top">
            <img src={userProfileImg} alt="" />
            <Title level={1}>Đăng nhập</Title>
          </div>
          <Form.Item
            name="username"
            label={"Tên đăng nhập"}
            rules={[
              {
                required: true,
                message: getMessage(
                  CODE_ERROR.ERROR_REQUIRED,
                  MESSAGE_ERROR,
                  "Tên Đăng Nhập"
                ),
              },
              {
                max: 25,
                message: getMessage(
                  CODE_ERROR.ERROR_NUMBER_MAX,
                  MESSAGE_ERROR,
                  "Tên Đăng Nhập",
                  25
                ),
              },
              {
                min: 8,
                message: getMessage(
                  CODE_ERROR.ERROR_NUMBER_MIN,
                  MESSAGE_ERROR,
                  "Tên Đăng Nhập",
                  8
                ),
              },
            ]}
            className="form_item"
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder="Tên đăng nhập"
              className="login_input"
            />
          </Form.Item>
          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              {
                required: true,
                message: getMessage(
                  CODE_ERROR.ERROR_REQUIRED,
                  MESSAGE_ERROR,
                  "Mật khẩu"
                ),
              },
              {
                max: 25,
                message: getMessage(
                  CODE_ERROR.ERROR_NUMBER_MAX,
                  MESSAGE_ERROR,
                  "Mật khẩu",
                  25
                ),
              },
              {
                min: 8,
                message: getMessage(
                  CODE_ERROR.ERROR_NUMBER_MIN,
                  MESSAGE_ERROR,
                  "Mật khẩu",
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
          <Form.Item className="form_item d-flex">
            {/* <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Ghi nhớ</Checkbox>
            </Form.Item> */}

            <a className="/login-form-forgot forgot" href="/forgot-password">
              Quên mật khẩu
            </a>
          </Form.Item>
          <Form.Item className="form_item">
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button= btn_signUp"
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Spin>
  );
}
