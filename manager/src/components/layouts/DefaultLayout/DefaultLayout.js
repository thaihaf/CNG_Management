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
import SettingModal from "components/modules/ChangePassword/ChangePassword";
import SettingDropDown from "components/modules/SettingDropDown/SettingDropDown";
import { DashboardPaths } from "features/dashboard/dashboard";
const { Content, Sider } = Layout;
const { Title, Text } = Typography;

const DefaultLayout = ({ children, routes }) => {
  const auth = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (auth?.role === "employee") {
      dispatch(getAccountAvatar());
    }
  }, [dispatch, location]);

  return (
    <Layout className="defaultLayout">
      <Sider
        style={{
          overflow: "auto",
          height: "100vh",
          flex: " 0 0 250px",
        }}
        className={`${collapsed ? "sidebar-collapsed" : "sidebar"}`}
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="wrapperSidebar">
          <div className="logo">
            {collapsed ? (
              <img
                src={logo}
                alt="logo"
                className="logo logo3_img"
                onClick={() => history.push(DashboardPaths.DASHBOARD_MANAGER)}
              />
            ) : (
              <img
                src={logo}
                alt="logo"
                className="logo logo5_img"
                onClick={() => history.push(DashboardPaths.DASHBOARD_MANAGER)}
              />
            )}
          </div>
          <Menu
            mode="inline"
            theme={"dark"}
            defaultSelectedKeys={[location.pathname]}
            items={siderBarItems}
            onSelect={(item) => history.push(item.key)}
          />
        </div>
      </Sider>

      <Layout
        style={{
          padding: "3rem 24px 24px",
          minHeight: "100vh",
          backgroundColor: "var(--bg-color)",
        }}
      >
        <FloatButton.BackTop />

        <div className="header">
          <Breadcrumb className="breadcrumb">
            {routes?.map((route) => (
              <Breadcrumb.Item
                href={!route.disable && route.path}
                key={route.path}
              >
                {route.icon} {route.label}
              </Breadcrumb.Item>
            ))}
          </Breadcrumb>

          <SettingDropDown />
        </div>

        <Content className="content">{children}</Content>

        <Footer className="footer" />
      </Layout>
    </Layout>
  );
};

export default React.memo(DefaultLayout);
