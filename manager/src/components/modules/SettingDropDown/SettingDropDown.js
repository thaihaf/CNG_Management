import React from "react";
import { Dropdown, Tooltip, Modal } from "antd";
import { useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { ExclamationCircleOutlined } from "@ant-design/icons";

import { AuthPaths, LOCAL_STORAGE_AUTH_KEY } from "features/auth/auth";

import avt_default from "assets/images/avt-default.png";
import logoutIcon from "assets/icons/logout.png";
import ChangePassword from "../ChangePassword/ChangePassword";
import Logout from "../Logout/Logout";

import "./SettingDropDown.css";

export default function SettingDropDown() {
  const auth = useSelector((state) => state.auth);
  const [modal1Open, setModal1Open] = useState(false);

  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();

  return (
    <Dropdown
      placement="bottomRight"
      arrow={{
        pointAtCenter: true,
      }}
      menu={{
        items: [
          {
            label: `Xin chào, ${auth?.userName}`,
            key: "fullName",
          },
          {
            label: `Vai trò : ${auth?.role}`,
            key: "role",
          },
          {
            type: "divider",
          },
          {
            label: <ChangePassword />,
            key: "change-pass",
          },
          {
            label: <Logout />,
            key: "logout",
          },
        ],
      }}
    >
      <div className="info">
        <div className="info_avt" onClick={() => setModal1Open(true)}>
          <img
            src={auth?.avatar ? auth?.avatar : avt_default}
            alt=""
            className="info_avt_img"
          />
        </div>
      </div>
    </Dropdown>
  );
}
