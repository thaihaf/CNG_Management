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
  FloatButton,
  Layout,
  Menu,
  Modal,
  notification,
  Typography,
} from "antd";
import { Footer } from "components";

import "./DefaultLayout.css";

import { siderBarItems } from "constants/items.constants";

import logo from "assets/images/logo.png";
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
import SettingModal from "components/modules/SettingModal/SettingModal";
const { Content, Sider } = Layout;
const { Title, Text } = Typography;

const DefaultLayout = ({ children }) => {
  const auth = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (auth?.role === "employee") {
      dispatch(getAccountAvatar());
    }
  }, [dispatch, location]);

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
      {/* <div className="left-bar" onMouseMove={() => setOpen(true)}></div> */}
      <FloatButton.BackTop />

      <Sider
        style={{
          overflow: "auto",
          height: "100vh",
          // position: "fixed",
          // left: 0,
          // top: 0,
          // bottom: 0,
          // zIndex: 22,
        }}
        className="sidebar"
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="logo">
          {collapsed ? (
            <img src={logo} alt="logo" />
          ) : (
            <img src={logo} alt="logo" />
          )}
        </div>
        <Menu
          mode="inline"
          theme={"dark"}
          defaultSelectedKeys={["user-manager", location.pathname]}
          items={siderBarItems}
          onSelect={(item) => history.push(item.key)}
        />
      </Sider>

      <Layout
        style={{
          padding: "3rem 24px 24px",
          minHeight: "100vh",
          backgroundColor: "var(--bg-color)",
        }}
      >
        <div className="header">
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

          {/* <Tooltip placement="bottomRight" title={"Đăng xuất"}>
              <div className="logout" onClick={handleLogout}>
                <img src={logoutIcon} alt="" />
                <span>Đăng xuất</span>
              </div>
            </Tooltip> */}

          <SettingModal />
        </div>

        <Content className="content">{children}</Content>

        <Footer className="footer" />
      </Layout>
    </Layout>
  );
};

export default React.memo(DefaultLayout);
