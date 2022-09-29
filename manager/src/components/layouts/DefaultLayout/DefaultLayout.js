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
               <Header className="header">
                    {
                         <span
                              onClick={() => setCollapsed(!collapsed)}
                              style={{ float: "left", cursor: "pointer" }}
                         >
                              {collapsed ? (
                                   <MenuUnfoldOutlined
                                        style={{
                                             fontSize: "16px",
                                             color: "#fff",
                                        }}
                                   />
                              ) : (
                                   <MenuFoldOutlined
                                        style={{
                                             fontSize: "16px",
                                             color: "#fff",
                                        }}
                                   />
                              )}
                         </span>
                    }

                    <div className={styles.logo} />
                    <Menu
                         theme="dark"
                         mode="horizontal"
                         defaultSelectedKeys={["2"]}
                         items={items1}
                    />
               </Header>
               {/* <Navigation />
               <Content className={styles.container}>
                    <Menu />
                    <div className={styles.content}>{children}</div>
               </Content> */}

               <Layout>
                    <Sider
                         className={styles.siteLayoutBackground}
                         width={200}
                         trigger={null}
                         collapsible
                         collapsed={collapsed}
                    >
                         <Menu
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
                    </Sider>

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
                              <Breadcrumb.Item href="/employee/detail/id=4">
                                   App
                              </Breadcrumb.Item>
                         </Breadcrumb>

                         <Content
                              className={styles.siteLayoutBackground}
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
