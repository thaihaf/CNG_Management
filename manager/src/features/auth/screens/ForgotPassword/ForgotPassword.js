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
} from "antd";

import { getMessage } from "helpers/util.helper";
import { CODE_ERROR } from "constants/errors.constants";
import { MESSAGE_ERROR } from "constants/messages.constants";
import {
     updateAccessToken,
     forgotPassword,
     updateError,
     updateUserName,
} from "../../auth";
import { EmployeeManagerPaths } from "features/employee-manager/employeeManager";

import "./ForgotPassword.css";
import { getIsLogin } from "helpers/auth.helpers";
import { LoadingSpinner } from "components";
import { SupplierManagerPaths } from "features/supplier-manager/supplierManager";

export default function ForgotPassword() {
     const dispatch = useDispatch();
     const { errorLogin, role } = useSelector((state) => state.auth);
     const history = useHistory();
     const [loading, setLoading] = useState(false);

     useEffect(() => {
          const isLogin = getIsLogin();
          if (isLogin == true) {
               history.push(EmployeeManagerPaths.EMPLOYEE_LIST);
          }
     });

     const onFinish = (values) => {
          setLoading(true);

          dispatch(forgotPassword({ data: values }))
               .then(unwrapResult)
               .then((res) => {
                    console.log(res);
                    message.success("Login success!");

                    // switch (res.role.substring(1, res.role.length - 1)) {
                    //      case "ROLE_ADMIN":
                    //           history.push(
                    //                EmployeeManagerPaths.EMPLOYEE_MANAGER
                    //           );
                    //           break;
                    //      case "ROLE_EMPLOYEE":
                    //           history.push(SupplierManagerPaths.SUPPLIER_LIST);
                    //           break;
                    // }
               })
               .catch((error) => {
                    console.log(error);
                    message.error("Username or password not correct");
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
                              ]}
                              className="form_item"
                         >
                              <Input
                                   prefix={
                                        <UserOutlined className="site-form-item-icon" />
                                   }
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
                                   Get Code
                              </Button>
                         </Form.Item>
                    </Form>
               </div>
          </Spin>
     );
}
