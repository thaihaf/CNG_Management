import React, { useState } from "react";
import { useEffect } from "react";
import {
     MenuFoldOutlined,
     MenuUnfoldOutlined,
     HomeOutlined,
} from "@ant-design/icons";

import { Breadcrumb, Layout, Menu } from "antd";
import { Footer } from "components";

import "./DefaultLayout.css";

import {
     siderBarAdminItems,
     siderBarEmployeeItems,
} from "constants/items.constants";

import logo5 from "assets/images/logo5.png";
import logo3 from "assets/images/logo3.png";
import avt from "assets/images/avt.jpg";
import { useHistory } from "react-router-dom";

const { Header, Content, Sider } = Layout;

const DefaultLayout = ({ children }) => {
     const [collapsed, setCollapsed] = useState(true);
     const [selectedItem, setSelectedItem] = useState("employee-list");

     const history = useHistory();

     useEffect(() => {
          window.scrollTo(0, 0);
     });

     const getSelect = ({ key }) => {
          let arr = key.toString().trim().split("-");
          setSelectedItem(key);
          history.push(`/${arr[0]}/${key}`);
     };

     return (
          <Layout className="defaultLayout">
               <Sider
                    className="siteLayoutBackground"
                    width={200}
                    trigger={null}
                    collapsible
                    collapsed={collapsed}
                    onCollapse={(value) => setCollapsed(value)}
               >
                    <div className="sidebar_children">
                         <div className="logo">
                              {collapsed ? (
                                   <img
                                        src={logo3}
                                        alt="logo"
                                        className="logo3_img"
                                   />
                              ) : (
                                   <img
                                        src={logo5}
                                        alt="logo"
                                        className="logo5_img"
                                   />
                              )}
                         </div>

                         <Menu
                              className="sidebarMenu"
                              mode="inline"
                              selectedKeys={[selectedItem]}
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
                              onClick={(item) => getSelect(item)}
                         />

                         <span className="toggleSidebar">
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
                    <Header className="header">
                         <div className="info">
                              <div className="info_avt">
                                   <img
                                        src={avt}
                                        alt=""
                                        className="info_avt_img"
                                   />
                              </div>

                              <div className="info_detail">
                                   <div className="info_fullname">
                                        Nguyen Thai Ha
                                   </div>
                                   <div className="info_role">Admin</div>
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
                                   <HomeOutlined /> Home
                              </Breadcrumb.Item>
                              <Breadcrumb.Item href="/employee/list">
                                   Employee List
                              </Breadcrumb.Item>
                              <Breadcrumb.Item>App</Breadcrumb.Item>
                         </Breadcrumb>

                         <Content
                              className="content"
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
