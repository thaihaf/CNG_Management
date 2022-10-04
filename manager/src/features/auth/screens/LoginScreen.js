import React from "react";
import { LockOutlined, UserOutlined } from "@ant-design/icons";
import { Button, Checkbox, Form, Input } from "antd";

import "antd/dist/antd.css";
import styles from "./LoginScreen.module.scss";
import cx from "classnames";
export default function LoginScreen() {
     const onFinish = (values) => {
          
     };

     return (
          <div className={styles.login}>
               <Form
                    name="normal_login"
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
                                   message: "Please input your Username!",
                              },
                         ]}
												 className={styles.form_item}
                    >
                         <Input
                              prefix={
                                   <UserOutlined className="site-form-item-icon" />
                              }
															
                              placeholder="Your Username"
															className={styles.login_input}
                         />
                    </Form.Item>
                    <Form.Item
                         name="password"
                         rules={[
                              {
                                   required: true,
                                   message: "Please input your Password!",
                              },
                         ]}
												 className={styles.form_item}
                    >
                         <Input
                              prefix={
                                   <LockOutlined className="site-form-item-icon" />
                              }
                              type="password"
                              placeholder="Your Password"
															className={styles.login_input}
                         />
                    </Form.Item>
                    <Form.Item className={cx(styles.form_item,styles.flex)}>
                         <Form.Item
                              name="remember"
                              valuePropName="checked"
                              noStyle
                         >
                              <Checkbox>Remember me</Checkbox>
                         </Form.Item>

                         <a className={cx("/login-form-forgot", styles.forgot)} href="/forgot">
                              Forgot password
                         </a>
                    </Form.Item>

                    <Form.Item className={styles.form_item}>
                         <Button
                              type="primary"
                              htmlType="submit"
                              className={cx("login-form-button=", styles.btn_signUp)}
                         >
                              Sign in
                         </Button>
                    </Form.Item>
               </Form>
          </div>
     );
}
