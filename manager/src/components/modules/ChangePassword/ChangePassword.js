import React from "react";
import { unwrapResult } from "@reduxjs/toolkit";
import {
  Button,
  Form,
  Input,
  Modal,
  Spin,
  Tabs,
  Tooltip,
  Typography,
  notification,
} from "antd";
import { changePassword } from "features/auth/auth";

import { BarcodeOutlined, SettingOutlined } from "@ant-design/icons";
import { CODE_ERROR } from "constants/errors.constants";
import { MESSAGE_ERROR } from "constants/messages.constants";
import { getMessage } from "helpers/util.helper";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import changePassIcon from "assets/icons/changePass.png";

import "./ChangePassword.css";

const { Text } = Typography;

export default function ChangePassword() {
  const auth = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const [changePassForm] = Form.useForm();

  const [modal1Open, setModal1Open] = useState(false);
  const [isLoadingModal, setIsLoadingModal] = useState(false);

  const handleChangePassword = (values) => {
    setIsLoadingModal(true);
    dispatch(changePassword({ data: values }))
      .then(unwrapResult)
      .then((res) => {
        notification.success({
          message: "Thay đổi mật khẩu",
          description: "Thay đổi mật khẩu thành công!",
        });
        setIsLoadingModal(false);
        changePassForm.resetFields();
      })
      .catch((error) => {
        if (error.errorKey === "currentPassword") {
          setIsLoadingModal(false);
          notification.warning({
            message: "Thay đổi mật khẩu",
            description: "Mật khẩu hiện tại không đúng, vui lòng kiểm tra lại!",
          });
        } else {
          notification.error({
            message: "Thay đổi mật khẩu",
            description: "Thay đổi mật khẩu thất bại!",
          });
        }
      });
  };

  return (
    <>
      <div className="changePass" onClick={() => setModal1Open(true)}>
        <img src={changePassIcon} alt="" className="imgChangePass" />
        <span>Thay đổi mật khẩu</span>
      </div>

      <Modal
        title="Cài đặt"
        style={{ top: 20 }}
        open={modal1Open}
        onOk={() => setModal1Open(false)}
        onCancel={() => setModal1Open(false)}
        footer={false}
        width={800}
        className="modalSetting"
      >
        <Spin spinning={isLoadingModal}>
          <Tabs
            tabPosition={"left"}
            items={[
              {
                label: (
                  <span>
                    <BarcodeOutlined />
                    Thay đổi mật khẩu
                  </span>
                ),
                key: "changePassword",
                children: (
                  <Form
                    form={changePassForm}
                    layout="horizontal"
                    name="changePassForm"
                    id="changePassForm"
                    colon={false}
                    onFinish={handleChangePassword}
                  >
                    <div className="details__group">
                      <Form.Item
                        name="currentPassword"
                        label={<Text>Mật khẩu hiện tại</Text>}
                        className="details__item"
                        rules={[
                          {
                            required: true,
                            message: getMessage(
                              CODE_ERROR.ERROR_REQUIRED,
                              MESSAGE_ERROR,
                              "Mật khẩu hiện tại"
                            ),
                          },
                          // {
                          //   pattern:
                          //     /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,25}$/,
                          //   message: getMessage(
                          //     CODE_ERROR.ERROR_FORMAT_PASSWORD,
                          //     MESSAGE_ERROR,
                          //     "Mật khẩu hiện tại"
                          //   ),
                          // },
                          {
                            max: 25,
                            message: getMessage(
                              CODE_ERROR.ERROR_MAX_LENGTH,
                              MESSAGE_ERROR,
                              "Mật khẩu hiện tại",
                              25
                            ),
                          },
                          {
                            min: 8,
                            message: getMessage(
                              CODE_ERROR.ERROR_MIN_LENGTH,
                              MESSAGE_ERROR,
                              "Mật khẩu hiện tại",
                              8
                            ),
                          },
                        ]}
                      >
                        <Input.Password
                          type="password"
                          placeholder="●●●●●●●●●"
                          className="login_input pass"
                        />
                      </Form.Item>
                    </div>
                    <div className="details__group">
                      <Form.Item
                        name="newPassword"
                        label={<Text>Mật khẩu mới</Text>}
                        className="details__item"
                        dependencies={["currentPassword"]}
                        rules={[
                          {
                            required: true,
                            message: getMessage(
                              CODE_ERROR.ERROR_REQUIRED,
                              MESSAGE_ERROR,
                              "Mật khẩu mới"
                            ),
                          },
                          // {
                          //   pattern:
                          //     /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,25}$/,
                          //   message: getMessage(
                          //     CODE_ERROR.ERROR_FORMAT_PASSWORD,
                          //     MESSAGE_ERROR,
                          //     "Mật khẩu mới"
                          //   ),
                          // },
                          {
                            max: 25,
                            message: getMessage(
                              CODE_ERROR.ERROR_MAX_LENGTH,
                              MESSAGE_ERROR,
                              "Mật khẩu mới",
                              25
                            ),
                          },
                          {
                            min: 8,
                            message: getMessage(
                              CODE_ERROR.ERROR_MIN_LENGTH,
                              MESSAGE_ERROR,
                              "Mật khẩu mới",
                              8
                            ),
                          },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (
                                !value ||
                                getFieldValue("currentPassword") !== value
                              ) {
                                return Promise.resolve();
                              }
                              return Promise.reject(
                                new Error(
                                  "Mật khẩu mới và Mật khẩu hiện tại phải khác nhau"
                                )
                              );
                            },
                          }),
                        ]}
                      >
                        <Input.Password
                          type="password"
                          placeholder="●●●●●●●●●"
                          className="login_input pass"
                        />
                      </Form.Item>
                    </div>
                    <div className="details__group">
                      <Form.Item
                        name="confirmNewPassword"
                        label={<Text>Xác nhận mật khẩu</Text>}
                        className="details__item"
                        dependencies={["newPassword"]}
                        rules={[
                          {
                            required: true,
                            message: getMessage(
                              CODE_ERROR.ERROR_REQUIRED,
                              MESSAGE_ERROR,
                              "Xác nhận mật khẩu"
                            ),
                          },
                          // {
                          //   pattern:
                          //     /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,25}$/,
                          //   message: getMessage(
                          //     CODE_ERROR.ERROR_FORMAT_PASSWORD,
                          //     MESSAGE_ERROR,
                          //     "Xác nhận mật khẩu"
                          //   ),
                          // },
                          {
                            max: 25,
                            message: getMessage(
                              CODE_ERROR.ERROR_MAX_LENGTH,
                              MESSAGE_ERROR,
                              "Xác nhận mật khẩu",
                              25
                            ),
                          },
                          {
                            min: 8,
                            message: getMessage(
                              CODE_ERROR.ERROR_MIN_LENGTH,
                              MESSAGE_ERROR,
                              "Xác nhận mật khẩu",
                              8
                            ),
                          },
                          ({ getFieldValue }) => ({
                            validator(_, value) {
                              if (
                                !value ||
                                getFieldValue("newPassword") === value
                              ) {
                                return Promise.resolve();
                              }
                              return Promise.reject(
                                new Error(
                                  "Xác nhận mật khẩu và Mật khẩu mới phải giống nhau"
                                )
                              );
                            },
                          }),
                        ]}
                      >
                        <Input.Password
                          type="password"
                          placeholder="●●●●●●●●●"
                          className="login_input pass"
                        />
                      </Form.Item>
                    </div>

                    <div className="btns">
                      <Button
                        key="back"
                        shape={"round"}
                        htmlType="reset"
                        onClick={() => {
                          setModal1Open(false);
                          changePassForm.resetFields();
                        }}
                      >
                        Huỷ bỏ
                      </Button>
                      <Button
                        key="submit"
                        shape={"round"}
                        type="primary"
                        htmlType="submit"
                      >
                        Xác nhận
                      </Button>
                    </div>
                  </Form>
                ),
              },
              // {
              //   label: (
              //     <span>
              //       <SettingOutlined />
              //       Hệ thống
              //     </span>
              //   ),
              //   key: "setting",
              //   children: `Content of Tab Pane 2`,
              // },
            ]}
          />
        </Spin>
      </Modal>
    </>
  );
}
