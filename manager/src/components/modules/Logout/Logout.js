import React from "react";
import { Dropdown, Tooltip, Modal } from "antd";
import { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { ExclamationCircleOutlined } from "@ant-design/icons";

import { AuthPaths, LOCAL_STORAGE_AUTH_KEY } from "features/auth/auth";

import avt_default from "assets/images/avt-default.png";
import logoutIcon from "assets/icons/logout.png";

import "./Logout.css";

export default function Logout() {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

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
    <div className="logout" onClick={handleLogout}>
      <img src={logoutIcon} alt="" className="imgLogout" />
      <span>Đăng xuất</span>
    </div>
  );
}
