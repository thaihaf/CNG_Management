import React, { useEffect, useState } from "react";
import cx from "classnames";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { unwrapResult } from "@reduxjs/toolkit";
import queryString from "query-string";

import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, Spin } from "antd";

import { getMessage } from "helpers/util.helper";
import { CODE_ERROR } from "constants/errors.constants";
import { MESSAGE_ERROR } from "constants/messages.constants";
import { resetPassword, AuthPaths } from "../../auth";

import "../ForgotPassword/ForgotPassword.css";
import { LoadingSpinner } from "components";

export default function ResetPassword() {
     const dispatch = useDispatch();
     const location = useLocation();
     const history = useHistory();

     const [loading, setLoading] = useState(false);

     console.log(location);

     const onFinish = (values) => {
          setLoading(true);
          console.log(values);

          dispatch(
               resetPassword({ data: { id: location.state.id, ...values } })
          )
               .then(unwrapResult)
               .then((res) => {
                    console.log(res);
                    message.success("Reset password successfull!");
                    history.push(AuthPaths.LOGIN);
               })
               .catch((error) => {
                    console.log(error);
                    message.error("Account ID not found");
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
                              name="newPassword"
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
                                        max: 25,
                                        message: getMessage(
                                             CODE_ERROR.ERROR_NUMBER_MAX,
                                             MESSAGE_ERROR,
                                             "Password",
                                             25
                                        ),
                                   },
                                   {
                                        min: 8,
                                        message: getMessage(
                                             CODE_ERROR.ERROR_NUMBER_MIN,
                                             MESSAGE_ERROR,
                                             "Password",
                                             8
                                        ),
                                   },
                              ]}
                              className="form_item"
                         >
                              <Input.Password
                                   prefix={
                                        <LockOutlined className="site-form-item-icon" />
                                   }
                                   type="password"
                                   placeholder="●●●●●●●●●"
                                   className="login_input"
                              />
                         </Form.Item>
                         <Form.Item
                              name="confirmNewPassword"
                              rules={[
                                   {
                                        required: true,
                                        message: getMessage(
                                             CODE_ERROR.ERROR_REQUIRED,
                                             MESSAGE_ERROR,
                                             "Confirm Password"
                                        ),
                                   },
                                   {
                                        max: 25,
                                        message: getMessage(
                                             CODE_ERROR.ERROR_NUMBER_MAX,
                                             MESSAGE_ERROR,
                                             "Confirm Password",
                                             25
                                        ),
                                   },
                                   {
                                        min: 8,
                                        message: getMessage(
                                             CODE_ERROR.ERROR_NUMBER_MIN,
                                             MESSAGE_ERROR,
                                             "Confirm Password",
                                             8
                                        ),
                                   },
                              ]}
                              className="form_item"
                         >
                              <Input.Password
                                   prefix={
                                        <LockOutlined className="site-form-item-icon" />
                                   }
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
                                   Change password
                              </Button>
                         </Form.Item>
                    </Form>
               </div>
          </Spin>
     );
}
