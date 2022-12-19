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
  Breadcrumb,
  Button,
  Drawer,
  FloatButton,
  Form,
  Input,
  Layout,
  Menu,
  message,
  Modal,
  notification,
  Spin,
  Tabs,
  Tooltip,
  Typography,
} from "antd";
import { Footer } from "components";

import "./DefaultLayout.css";

import { siderBarItems } from "constants/items.constants";

import logo from "assets/images/logo.jpg";
import logo5 from "assets/images/logo5.png";
import logo3 from "assets/images/logo3.png";
import logoutIcon from "assets/icons/logout.png";
import avt_default from "assets/images/avt-default.png";

import { useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  AuthPaths,
  LOCAL_STORAGE_AUTH_KEY,
  changePassword,
  getAccountAvatar,
} from "features/auth/auth";
import { unwrapResult } from "@reduxjs/toolkit";
import { getMessage } from "helpers/util.helper";
import { CODE_ERROR } from "constants/errors.constants";
import { MESSAGE_ERROR } from "constants/messages.constants";
import SettingModal from "components/modules/SettingModal/SettingModal";
const { Content, Sider } = Layout;
const { Title, Text } = Typography;

const DefaultLayout = ({ children }) => {
  // const { userName, role, avatar } = useSelector((state) => state.auth);
  const auth = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const pathname = location.pathname.split("/")[1];

  const [collapsed, setCollapsed] = useState(false);

  const [open, setOpen] = useState(false);
  const showDrawer = () => {
    setOpen(true);
  };
  const onClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (auth?.role === "employee") {
      dispatch(getAccountAvatar());
    }
  }, [dispatch, location]);

  const getSelect = ({ key }) => {
    history.push(`/${key}`);
  };

  const handleLogout = () => {
    Modal.confirm({
      title: "Xác nhận",
      icon: <ExclamationCircleOutlined />,
      content: "Bạn có chắc chắn muốn Đăng xuất không?",
      okText: "Đăng xuất",
      cancelText: "Huỷ bỏ",
      onOk: () => {
        dispatch({ type: "LOGOUT" });
        history.push(AuthPaths.LOGIN);
        localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY);
        localStorage.clear();
      },
      onCancel: () => {},
    });
  };

  return (
    <Layout className="defaultLayout">
      <div className="left-bar" onMouseMove={() => setOpen(true)}></div>
      <FloatButton.BackTop />
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
              <img src={logo} alt="logo" className="logo3_img" />
            ) : (
              <img src={logo} alt="logo" className="logo5_img" />
            )}
          </div>

          <Menu
            className="sidebarMenu"
            mode="inline"
            selectedKeys={[pathname]}
            style={{ height: "100%" }}
            items={siderBarItems.map((item) => {
              if (item.role.includes(auth?.role)) {
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

          <SettingModal />
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
              {location.pathname.split("/").map((item, index, arr) => {
                if (index === 0) {
                  return (
                    <Breadcrumb.Item href={`/${item}`} key={item}>
                      <HomeOutlined /> Home
                    </Breadcrumb.Item>
                  );
                }
                if (arr[index - 1] !== "details") {
                  return (
                    <Breadcrumb.Item href={`/${item}`} key={`/${item}`}>
                      {item
                        .split("-")
                        .map((word) => {
                          return word[0].toUpperCase() + word.substring(1);
                        })
                        .join(" ")}
                    </Breadcrumb.Item>
                  );
                }
              })}
            </Breadcrumb>

            <Tooltip placement="bottomRight" title={"Đăng xuất"}>
              <div className="logout" onClick={handleLogout}>
                <img src={logoutIcon} alt="" />
                <span>Đăng xuất</span>
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
