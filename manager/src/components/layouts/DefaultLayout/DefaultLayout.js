import React, { useState } from "react";
import { useEffect } from "react";

import { Breadcrumb, FloatButton, Layout, Menu } from "antd";
import { Footer } from "components";

import "./DefaultLayout.css";

import { getSideBarItems, listKeySideBar } from "constants/items.constants";

import logo from "assets/images/logo.png";

import { useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { getAccountAvatar } from "features/auth/auth";
import SettingDropDown from "components/modules/SettingDropDown/SettingDropDown";
import { DashboardPaths } from "features/dashboard/dashboard";
import { motion } from "framer-motion/dist/framer-motion";

const { Content, Sider } = Layout;

const DefaultLayout = ({ children, routes }) => {
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

  return (
    <Layout className="defaultLayout">
      <motion.div
        animate={{ opacity: [0, 1], x: [-150, 0] }}
        exit={{ opacity: [1, 0] }}
        transition={{ duration: 0.2 }}
        className={`${collapsed ? "sidebar-collapsed" : "sidebar"}`}
        style={{
          overflow: "auto",
          height: "100vh",
          flex: " 0 0 250px",
        }}
      >
        <Sider
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
                  onClick={() => history.push(DashboardPaths.DASHBOARD)}
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
              items={getSideBarItems(auth.role)}
              onSelect={(item) => history.push(item.key)}
              // defaultOpenKeys={listKeySideBar}
            />
          </div>
        </Sider>
      </motion.div>

      <Layout
        style={{
          padding: "3rem 24px 24px",
          minHeight: "100vh",
          backgroundColor: "var(--bg-color)",
        }}
      >
        <FloatButton.BackTop />

        <motion.div
          className="header"
          animate={{ opacity: [0, 1], x: [150, 0] }}
          exit={{ opacity: [1, 0] }}
          transition={{ duration: 0.2 }}
        >
          <Breadcrumb className="breadcrumb">
            {routes?.map((route) => (
              <Breadcrumb.Item
                href={route.visible ? route.path : undefined}
                key={route.path}
              >
                {route.icon} {route.label}
              </Breadcrumb.Item>
            ))}
          </Breadcrumb>

          <SettingDropDown />
        </motion.div>

        <motion.div
          animate={{ opacity: [0, 1], x: [150, 0] }}
          exit={{ opacity: [1, 0] }}
          transition={{ duration: 0.2 }}
        >
          <Content className="content">{children}</Content>

          <Footer className="footer" />
        </motion.div>
      </Layout>
    </Layout>
  );
};

export default React.memo(DefaultLayout);
