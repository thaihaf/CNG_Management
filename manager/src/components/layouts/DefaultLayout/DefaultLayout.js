import React, { useState } from "react";
import { useEffect } from "react";
import {
     MenuFoldOutlined,
     MenuUnfoldOutlined,
     HomeOutlined,
     LogoutOutlined,
     ProfileTwoTone,
     SettingTwoTone,
} from "@ant-design/icons";

import { Breadcrumb, Dropdown, Layout, Menu } from "antd";
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
import { useSelector } from "react-redux";
import { AuthPaths } from "features/auth/auth";

const { Header, Content, Sider } = Layout;

const DefaultLayout = ({ children }) => {
     const [collapsed, setCollapsed] = useState(false);
     const [selectedItem, setSelectedItem] = useState("employee-list");
     const auth = useSelector((state) => state.auth);

     const history = useHistory();

     useEffect(() => {
          window.scrollTo(0, 0);
     });

     const getSelect = ({ key }) => {
          let arr = key.toString().trim().split("-");
          setSelectedItem(key);
          history.push(`/${arr[0]}/${key}`);
     };

     const menu = (
          <Menu
               items={[
                    {
                         key: "1",
                         label: (
                              <a href="https://www.antgroup.com" className="menu-item">
                                   <ProfileTwoTone />
                                   <span>Profile</span>
                              </a>
                         ),
                    },
                    {
                         key: "2",
                         label: (
                              <a href="https://www.aliyun.com" className="menu-item">
                                   <SettingTwoTone />
                                   <span>Setting</span>
                              </a>
                         ),
                    },
                    {
                         key: "3",
                         label: (
                              <a href={AuthPaths.LOGOUT} className="menu-item">
                                   <LogoutOutlined
                                        style={{ color: "#52c41a" }}
                                   />
                                   <span>Logout</span>
                              </a>
                         ),
                    },
               ]}
          />
     );

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
                         <Dropdown overlay={menu} placement="bottomLeft" arrow>
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
                                             {auth.userName}
                                        </div>
                                        <div className="info_role">
                                             {auth.role &&
                                                  auth.role.split("_")[1]}
                                        </div>
                                   </div>
                              </div>
                         </Dropdown>
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
