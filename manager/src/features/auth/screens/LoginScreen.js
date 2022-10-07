import React, { useEffect } from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Alert, Button, Checkbox, Form, Input, notification } from "antd";

import styles from "./LoginScreen.module.scss";
import cx from "classnames";
import { getMessage } from "helpers/util.helper";
import { CODE_ERROR } from "constants/errors.constants";
import { MESSAGE_ERROR } from "constants/messages.constants";
import { useHistory } from "react-router-dom";
import { EmployeeManagerPaths } from "features/employee-manager/employeeManager";
import { unwrapResult } from "@reduxjs/toolkit";
import {
     updateAccessToken,
     postLogin,
     updateError,
     updateUserName,
} from "../auth";
import { useSelector, useDispatch } from "react-redux";

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
          <div className={styles.login}>
               <Form
                    name="login"
                    className={styles.form}
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
                         className={styles.form_item}
                    >
                         <Input
                              prefix={
                                   <UserOutlined className="site-form-item-icon" />
                              }
                              placeholder="username"
                              className={styles.login_input}
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
                         className={styles.form_item}
                    >
                         <Input
                              prefix={
                                   <LockOutlined className="site-form-item-icon" />
                              }
                              type="password"
                              placeholder="●●●●●●●●●"
                              className={styles.login_input}
                         />
                    </Form.Item>
                    <Form.Item className={cx(styles.form_item, styles.flex)}>
                         <Form.Item
                              name="remember"
                              valuePropName="checked"
                              noStyle
                         >
                              <Checkbox>Remember me</Checkbox>
                         </Form.Item>

                         <a
                              className={cx(
                                   "/login-form-forgot",
                                   styles.forgot
                              )}
                              href="/forgot"
                         >
                              Forgot password
                         </a>
                    </Form.Item>

                    <Form.Item className={styles.form_item}>
                         <Button
                              type="primary"
                              htmlType="submit"
                              className={cx(
                                   "login-form-button=",
                                   styles.btn_signUp
                              )}
                         >
                              Sign in
                         </Button>
                    </Form.Item>
               </Form>
          </div>
     );
}
