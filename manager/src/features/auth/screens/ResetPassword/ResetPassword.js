import React, { useEffect, useState } from "react";
import cx from "classnames";
import { useSelector, useDispatch } from "react-redux";
import { useHistory, useLocation } from "react-router-dom";
import { unwrapResult } from "@reduxjs/toolkit";
import queryString from "query-string";

import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Form, Input, message, notification, Spin } from "antd";

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
                    notification.success({
                      message: "Quên mật khẩu",
                      description: "Thay đổi mật khẩu thành công",
                    });
                    history.push(AuthPaths.LOGIN);
               })
               .catch((error) => {
                    notification.error({
                      message: "Quên mật khẩu",
                      description: "Không tìm thấy Tên đăng nhập",
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
               name="newPassword"
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
                   pattern:
                     /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/,
                   message: getMessage(
                     CODE_ERROR.ERROR_FORMAT_PASSWORD,
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
             <Form.Item
               name="confirmNewPassword"
               rules={[
                 {
                   required: true,
                   message: getMessage(
                     CODE_ERROR.ERROR_REQUIRED,
                     MESSAGE_ERROR,
                     "Xác nhận mật khẩu"
                   ),
                 },
                 {
                   max: 25,
                   message: getMessage(
                     CODE_ERROR.ERROR_NUMBER_MAX,
                     MESSAGE_ERROR,
                     "Xác nhận mật khẩu",
                     25
                   ),
                 },
                 {
                   min: 8,
                   message: getMessage(
                     CODE_ERROR.ERROR_NUMBER_MIN,
                     MESSAGE_ERROR,
                     "Xác nhận mật khẩu",
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

             <Form.Item className="form_item">
               <Button
                 type="primary"
                 htmlType="submit"
                 className="login-form-button= btn_signUp"
               >
                 Thay đổi mật khẩu
               </Button>
             </Form.Item>
           </Form>
         </div>
       </Spin>
     );
}
