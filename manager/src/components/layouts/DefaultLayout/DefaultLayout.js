import React, { useState } from "react";
import { useEffect } from "react";
import {
     LaptopOutlined,
     NotificationOutlined,
     UserOutlined,
     MenuFoldOutlined,
     MenuUnfoldOutlined,
     VideoCameraOutlined,
     UploadOutlined,
     BarChartOutlined,
     CloudOutlined,
     AppstoreOutlined,
     TeamOutlined,
     ShopOutlined,
     HomeOutlined,
} from "@ant-design/icons";
import { Breadcrumb, Layout, Menu } from "antd";
import { Footer } from "components";

// import Menu from "@app/components/molecules/Menu/Menu";
// import Navigation from "@app/components/molecules/Navigation/Navigation";

import "antd/dist/antd.css";
import styles from "./DefaultLayout.module.scss";
import {
     siderBarAdminItems,
     siderBarEmployeeItems,
} from "constants/items.constants";

import logo5 from "assets/images/logo5.png";
import logo3 from "assets/images/logo3.png";

const { Header, Content, Sider } = Layout;

const items1 = ["1", "2", "3"].map((key) => ({
     key,
     label: `nav ${key}`,
}));

const DefaultLayout = ({ children }) => {
     const [collapsed, setCollapsed] = useState(false);

     useEffect(() => {
          window.scrollTo(0, 0);
     });
     return (
          <Layout className={styles.defaultLayout}>
               <Sider
                    className={styles.siteLayoutBackground}
                    width={200}
                    trigger={null}
                    collapsible
                    collapsed={collapsed}
                    onCollapse={(value) => setCollapsed(value)}
               >
                    <div className={styles.sidebar_children}>
                         <div className={styles.logo}>
                              {collapsed ? (
                                   <img
                                        src={logo3}
                                        alt="logo"
                                        className={styles.logo3_img}
                                   />
                              ) : (
                                   <img
                                        src={logo5}
                                        alt="logo"
                                        className={styles.logo5_img}
                                   />
                              )}
                         </div>

                         <Menu
                              className={styles.sidebarMenu}
                              mode="inline"
                              defaultSelectedKeys={siderBarAdminItems[0].key}
                              defaultOpenKeys={["sub1"]}
                              style={{ height: "100%" }}
                              theme={"dark"}
                              items={siderBarAdminItems.map((item) => {
                                   return {
                                        key: item.key,
                                        icon: item.icon,
                                        label: item.label,
                                        children:
                                             item.children &&
                                             item.children.map((child) => {
                                                  return {
                                                       key: child.key,
                                                       label: child.label,
                                                  };
                                             }),
                                   };
                              })}
                         />

                         <span className={styles.toggleSidebar}>
                              {collapsed ? (
                                   <MenuUnfoldOutlined
                                        style={{
                                             fontSize: "22px",
                                             color: "#fff",
                                        }}
                                        onClick={() => setCollapsed(!collapsed)}
                                   />
                              ) : (
                                   <MenuFoldOutlined
                                        style={{
                                             fontSize: "22px",
                                             color: "#fff",
                                        }}
                                        onClick={() => setCollapsed(!collapsed)}
                                   />
                              )}
                         </span>
                    </div>
               </Sider>

               <Layout>
                    <Header className={styles.header}>
                         <div className={styles.info}>
                              <div className={styles.info_avt}>
                                   <img
                                        src={logo5}
                                        alt=""
                                        className={styles.info_avt_img}
                                   />
                              </div>

                              <div className={styles.info_detail}>
                                   <div className={styles.info_fullname}>
                                        Nguyen Thai Ha
                                   </div>
                                   <div className={styles.info_role}>Admin</div>
                              </div>
                         </div>
                    </Header>

                    <Layout
                         style={{
                              padding: "0 24px 24px",
                         }}
                    >
                         <Breadcrumb
                              style={{
                                   margin: "16px 0",
                              }}
                         >
                              <Breadcrumb.Item href="/">
                                   <HomeOutlined />
                              </Breadcrumb.Item>
                              <Breadcrumb.Item href="/employee/list">
                                   Employee List
                              </Breadcrumb.Item>
                              <Breadcrumb.Item>App</Breadcrumb.Item>
                         </Breadcrumb>

                         <Content
                              className={styles.content}
                              style={{
                                   padding: 24,
                                   margin: 0,
                                   minHeight: 280,
                              }}
                         >
                              {children}
                         </Content>

                         <Footer />
                    </Layout>
               </Layout>
          </Layout>
     );
};

export default DefaultLayout;
