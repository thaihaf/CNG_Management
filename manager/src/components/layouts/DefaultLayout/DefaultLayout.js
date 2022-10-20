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

import { Breadcrumb, Dropdown, Layout, Menu, Tooltip } from "antd";
import { Footer } from "components";

import "./DefaultLayout.css";

import { siderBarItems } from "constants/items.constants";

import logo5 from "assets/images/logo5.png";
import logo3 from "assets/images/logo3.png";
import avt from "assets/images/avt.jpg";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AuthPaths } from "features/auth/auth";
import logout from "assets/images/logout.png";
import { postLogout } from "features/auth/auth";
const { Header, Content, Sider } = Layout;

const DefaultLayout = ({ children }) => {
     const [collapsed, setCollapsed] = useState(false);
     const { userName, role } = useSelector((state) => state.auth);

     const dispatch = useDispatch();
     const history = useHistory();
     const location = useLocation();

     const pathname = location.pathname.split("/")[1];

     useEffect(() => {
          window.scrollTo(0, 0);
     });

     const getSelect = ({ key }) => {
          history.push(`/${key}`);
     };

     const handleLogout = () => {
          dispatch(postLogout());
          localStorage.removeItem("persist:auth");
          history.push(AuthPaths.LOGIN);
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
                              <div className="info_avt">
                                   <img
                                        src={avt}
                                        alt=""
                                        className="info_avt_img"
                                   />
                              </div>

                              <div className="info_detail">
                                   <div className="info_fullname">
                                        {userName}
                                   </div>
                                   <div className="info_role">{role}</div>
                              </div>
                         </div>
                    </div>
               </Sider>

               <Layout className="wrapper_layout">
                    <Layout
                         style={{
                              padding: "3rem 24px 24px",
                              minHeight: "100vh",
                         }}
                    >
                         <div className="top2">
                              <Breadcrumb className="breadcrumb">
                                   {location.pathname
                                        .split("/")
                                        .map((item, index) => {
                                             if (index === 0) {
                                                  return (
                                                       <Breadcrumb.Item
                                                            href={`/${item}`}
                                                            key={item}
                                                       >
                                                            <HomeOutlined />{" "}
                                                            Home
                                                       </Breadcrumb.Item>
                                                  );
                                             }
                                             return (
                                                  <Breadcrumb.Item
                                                       href={`/${item}`}
                                                       key={`/${item}`}
                                                  >
                                                       {item
                                                            .split(" ")
                                                            .map((word) => {
                                                                 return (
                                                                      word[0].toUpperCase() +
                                                                      word.substring(
                                                                           1
                                                                      )
                                                                 );
                                                            })
                                                            .join(" ")}
                                                  </Breadcrumb.Item>
                                             );
                                        })}
                              </Breadcrumb>

                              <Tooltip placement="bottomRight" title={"Logout"}>
                                   <div
                                        className="logout"
                                        onClick={handleLogout}
                                   >
                                        <img src={logout} alt="" />
                                        <span> Logout</span>
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
