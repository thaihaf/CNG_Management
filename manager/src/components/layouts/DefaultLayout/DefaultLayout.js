import React, { useState } from "react";
import { useEffect } from "react";
import {
  HomeOutlined,
  BarcodeOutlined,
  SettingOutlined,
  ExclamationCircleOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";

import {
  BackTop,
  Breadcrumb,
  Button,
  Drawer,
  Form,
  Input,
  Layout,
  Menu,
  message,
  Modal,
  Spin,
  Tabs,
  Tooltip,
  Typography,
} from "antd";
import { Footer } from "components";

import "./DefaultLayout.css";

import { siderBarItems } from "constants/items.constants";

import logo5 from "assets/images/logo5.png";
import logo3 from "assets/images/logo3.png";
import logoutIcon from "assets/icons/logout.png";
import avt_default from "assets/images/avt-default.png";

import { useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  AuthPaths,
  changePassword,
  getAccountAvatar,
} from "features/auth/auth";
import { unwrapResult } from "@reduxjs/toolkit";
import { getMessage } from "helpers/util.helper";
import { CODE_ERROR } from "constants/errors.constants";
import { MESSAGE_ERROR } from "constants/messages.constants";
const { Content, Sider } = Layout;
const { Title, Text } = Typography;

const DefaultLayout = ({ children }) => {
  const { userName, role, avatar } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const [changePassForm] = Form.useForm();
  const pathname = location.pathname.split("/")[1];

  const [collapsed, setCollapsed] = useState(false);
  const [modal1Open, setModal1Open] = useState(false);
  const [isLoadingModal, setIsLoadingModal] = useState(false);

  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    dispatch(getAccountAvatar());
  }, [dispatch]);

  const getSelect = ({ key }) => {
    history.push(`/${key}`);
  };

  const handleLogout = () => {
    Modal.confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      content: "Are you sure want to Logout",
      okText: "Logout",
      cancelText: "Cancel",
      onOk: () => {
        dispatch({ type: "LOGOUT" });
        history.push(AuthPaths.LOGIN);
        localStorage.removeItem("persist:auth");
      },
      onCancel: () => {},
    });
  };

  const handleChangePassword = (values) => {
    setIsLoadingModal(true);
    dispatch(changePassword({ data: values }))
      .then(unwrapResult)
      .then((res) => {
        message.success("Change password success!");
        setIsLoadingModal(false);
        changePassForm.resetFields();
      })
      .catch((error) => {
        if (error.errorKey === "currentPassword") {
          setIsLoadingModal(false);
          message.error("Current Password not correct, check again!");
        } else {
          message.error("Check err in F12");
        }
      });
  };

  return (
    <Layout className="defaultLayout">
      <div
        className="left-bar"
        onMouseMove={() => setOpen(true)}
      ></div>
      <BackTop />

      <Drawer
        placement={"left"}
        closable={false}
        onClose={onClose}
        open={open}
        className="drawer"
      >
        <div className="sidebar_children">
          <div className="logo">
            {collapsed ? (
              <img src={logo3} alt="logo" className="logo3_img" />
            ) : (
              <img src={logo5} alt="logo" className="logo5_img" />
            )}
          </div>

          <Menu
            className="sidebarMenu"
            mode="inline"
            selectedKeys={[pathname]}
            style={{ height: "100%" }}
            items={siderBarItems.map((item) => {
              if (item.role.includes(role)) {
                return {
                  key: item.key,
                  icon: item.icon,
                  label: item.label,
                };
              }
            })}
            onClick={(item) => getSelect(item)}
          />

          {/* <span className="toggleSidebar">
                              {collapsed ? (
                                   <MenuUnfoldOutlined
                                        style={{
                                             fontSize: "22px",
                                        }}
                                        onClick={() => setCollapsed(!collapsed)}
                                   />
                              ) : (
                                   <MenuFoldOutlined
                                        style={{
                                             fontSize: "22px",
                                        }}
                                        onClick={() => setCollapsed(!collapsed)}
                                   />
                              )}
                         </span> */}

          <div className="info">
            <Tooltip placement="topRight" title={"Click to show Menubar"}>
              <div className="info_avt" onClick={() => setModal1Open(true)}>
                <img
                  src={avatar ? avatar : avt_default}
                  alt=""
                  className="info_avt_img"
                />
              </div>
            </Tooltip>

            <div className="info_detail">
              <div className="info_fullname">{userName}</div>
              <div className="info_role">{role}</div>
            </div>

            <Modal
              title="Menu"
              style={{ top: 20 }}
              open={modal1Open}
              onOk={() => setModal1Open(false)}
              onCancel={() => setModal1Open(false)}
              footer={[]}
              width={800}
              className="modalSetting"
            >
              <Spin spinning={isLoadingModal}>
                <Tabs
                  //  defaultActiveKey="2"
                  tabPosition={"left"}
                  items={[
                    {
                      label: (
                        <span>
                          <BarcodeOutlined />
                          Change Password
                        </span>
                      ),
                      key: "changePassword",
                      children: (
                        <Form
                          form={changePassForm}
                          labelCol={{
                            span: 4,
                          }}
                          wrapperCol={{
                            span: 14,
                          }}
                          layout="horizontal"
                          name="changePassForm"
                          id="changePassForm"
                          colon={false}
                          onFinish={handleChangePassword}
                        >
                          <div className="details__group">
                            <Form.Item
                              name="currentPassword"
                              label={<Text>Current Password</Text>}
                              className="details__item"
                              rules={[
                                {
                                  required: true,
                                  message: getMessage(
                                    CODE_ERROR.ERROR_REQUIRED,
                                    MESSAGE_ERROR,
                                    "Current Password"
                                  ),
                                },
                                {
                                  max: 25,
                                  message: getMessage(
                                    CODE_ERROR.ERROR_MAX_LENGTH,
                                    MESSAGE_ERROR,
                                    "Current Password",
                                    25
                                  ),
                                },
                                {
                                  min: 8,
                                  message: getMessage(
                                    CODE_ERROR.ERROR_MIN_LENGTH,
                                    MESSAGE_ERROR,
                                    "Current Password",
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
                              label={<Text>New Password</Text>}
                              className="details__item"
                              dependencies={["currentPassword"]}
                              rules={[
                                {
                                  required: true,
                                  message: getMessage(
                                    CODE_ERROR.ERROR_REQUIRED,
                                    MESSAGE_ERROR,
                                    "New Password"
                                  ),
                                },
                                {
                                  max: 25,
                                  message: getMessage(
                                    CODE_ERROR.ERROR_MAX_LENGTH,
                                    MESSAGE_ERROR,
                                    "New Password",
                                    25
                                  ),
                                },
                                {
                                  min: 8,
                                  message: getMessage(
                                    CODE_ERROR.ERROR_MIN_LENGTH,
                                    MESSAGE_ERROR,
                                    "New Password",
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
                                        "The Current passwords and New passwords that you entered match!"
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
                              label={<Text>Confirm New Password</Text>}
                              className="details__item"
                              dependencies={["newPassword"]}
                              rules={[
                                {
                                  required: true,
                                  message: getMessage(
                                    CODE_ERROR.ERROR_REQUIRED,
                                    MESSAGE_ERROR,
                                    "Confirm New Password"
                                  ),
                                },
                                {
                                  max: 25,
                                  message: getMessage(
                                    CODE_ERROR.ERROR_MAX_LENGTH,
                                    MESSAGE_ERROR,
                                    "Confirm New Password",
                                    25
                                  ),
                                },
                                {
                                  min: 8,
                                  message: getMessage(
                                    CODE_ERROR.ERROR_MIN_LENGTH,
                                    MESSAGE_ERROR,
                                    "Confirm New Password",
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
                                        "The New passwords and Confirm passwords that you entered do not match!"
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
                              Cancel
                            </Button>
                            <Button
                              key="submit"
                              shape={"round"}
                              type="primary"
                              htmlType="submit"
                            >
                              Submit
                            </Button>
                          </div>
                        </Form>
                      ),
                    },
                    {
                      label: (
                        <span>
                          <SettingOutlined />
                          Setting
                        </span>
                      ),
                      key: "setting",
                      children: `Content of Tab Pane 2`,
                    },
                  ]}
                />
              </Spin>
            </Modal>
          </div>
        </div>
      </Drawer>

      <Layout className="wrapper_layout">
        <Layout
          style={{
            padding: "3rem 24px 24px",
            minHeight: "100vh",
          }}
        >
          <div className="top2">
            <MenuUnfoldOutlined
              style={{
                fontSize: "22px",
                marginRight: "3rem",
                color: "black",
              }}
              onClick={showDrawer}
            />

            <Breadcrumb className="breadcrumb">
              {location.pathname.split("/").map((item, index) => {
                if (index === 0) {
                  return (
                    <Breadcrumb.Item href={`/${item}`} key={item}>
                      <HomeOutlined /> Home
                    </Breadcrumb.Item>
                  );
                }
                return (
                  <Breadcrumb.Item href={`/${item}`} key={`/${item}`}>
                    {item
                      .split(" ")
                      .map((word) => {
                        return word[0].toUpperCase() + word.substring(1);
                      })
                      .join(" ")}
                  </Breadcrumb.Item>
                );
              })}
            </Breadcrumb>

            <Tooltip placement="bottomRight" title={"Logout"}>
              <div className="logout" onClick={handleLogout}>
                <img src={logoutIcon} alt="" />
                <span>Logout</span>
              </div>
            </Tooltip>
          </div>

          <Content className="content">{children}</Content>

          <Footer className="footer" />
        </Layout>
      </Layout>
    </Layout>
  );
};

export default React.memo(DefaultLayout);
