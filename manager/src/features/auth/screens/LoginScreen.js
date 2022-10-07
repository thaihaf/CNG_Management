import React, { useEffect } from "react";
import cx from "classnames";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { unwrapResult } from "@reduxjs/toolkit";

import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Alert, Button, Checkbox, Form, Input, notification } from "antd";

import { getMessage } from "helpers/util.helper";
import { CODE_ERROR } from "constants/errors.constants";
import { MESSAGE_ERROR } from "constants/messages.constants";
import {
	updateAccessToken,
	postLogin,
	updateError,
	updateUserName,
} from "../auth";
import { EmployeeManagerPaths } from "features/employee-manager/employeeManager";

import "./LoginScreen.css";

export default function LoginScreen() {
     const dispatch = useDispatch();
     const errorLogin = useSelector((state) => state.auth.errorLogin);
     const history = useHistory();

     useEffect(() => {
          const isLogin = localStorage.getItem("isLogin");
          if (isLogin) {
               history.push(EmployeeManagerPaths.EMPLOYEE_LIST);
          }
     });

     const openNotificationWithIcon = (type, mess, des) => {
          notification[type]({
               message: mess,
               description: des,
          });
     };

     const onFinish = (values) => {
          const { username, password } = values;
          const authenticationData = {
               username,
               password,
          };

          dispatch(postLogin({ data: authenticationData }))
               .then(unwrapResult)
               .then((res) => {
                    if (res.success) {
                         console.log(res);
                         openNotificationWithIcon(
                              "success",
                              "Status : 200",
                              "Login successfull"
                         );
                    }
               })
               .catch(() => {
                    dispatch(updateError(CODE_ERROR.ERROR_LOGIN));
                    openNotificationWithIcon(
                         "error",
                         "Status : 401",
                         getMessage(errorLogin, MESSAGE_ERROR)
                    );
               });
     };

     return (
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
                         name="username"
                         rules={[
                              {
                                   required: true,
                                   message: getMessage(
                                        CODE_ERROR.ERROR_REQUIRED,
                                        MESSAGE_ERROR,
                                        "Username"
                                   ),
                              },
                              {
                                   max: 20,
                                   message: getMessage(
                                        CODE_ERROR.ERROR_NUMBER_MAX,
                                        MESSAGE_ERROR,
                                        "Username",
                                        20
                                   ),
                              },
                              {
                                   min: 3,
                                   message: getMessage(
                                        CODE_ERROR.ERROR_NUMBER_MIN,
                                        MESSAGE_ERROR,
                                        "Username",
                                        3
                                   ),
                              },
                         ]}
                         className="form_item"
                    >
                         <Input
                              prefix={
                                   <UserOutlined className="site-form-item-icon" />
                              }
                              placeholder="username"
                              className="login_input"
                         />
                    </Form.Item>
                    <Form.Item
                         name="password"
                         rules={[
                              {
                                   required: true,
                                   message: getMessage(
                                        CODE_ERROR.ERROR_REQUIRED,
                                        MESSAGE_ERROR,
                                        "Password"
                                   ),
                              },
                              {
                                   max: 20,
                                   message: getMessage(
                                        CODE_ERROR.ERROR_NUMBER_MAX,
                                        MESSAGE_ERROR,
                                        "Password",
                                        20
                                   ),
                              },
                              {
                                   min: 3,
                                   message: getMessage(
                                        CODE_ERROR.ERROR_NUMBER_MIN,
                                        MESSAGE_ERROR,
                                        "Password",
                                        3
                                   ),
                              },
                         ]}
                         className="form_item"
                    >
                         <Input
                              prefix={
                                   <LockOutlined className="site-form-item-icon" />
                              }
                              type="password"
                              placeholder="●●●●●●●●●"
                              className="login_input"
                         />
                    </Form.Item>
                    <Form.Item className="form_item flex">
                         <Form.Item
                              name="remember"
                              valuePropName="checked"
                              noStyle
                         >
                              <Checkbox>Remember me</Checkbox>
                         </Form.Item>

                         <a
                              className="/login-form-forgot forgot"
                              href="/forgot"
                         >
                              Forgot password
                         </a>
                    </Form.Item>

                    <Form.Item className="form_item">
                         <Button
                              type="primary"
                              htmlType="submit"
                              className="login-form-button= btn_signUp"
                         >
                              Sign in
                         </Button>
                    </Form.Item>
               </Form>
          </div>
     );
}
