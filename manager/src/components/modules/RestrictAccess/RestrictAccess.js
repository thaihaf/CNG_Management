import React from "react";
import { Button, Result } from "antd";
// import { useTranslation } from "react-i18next";
import homeImg from "assets/icons/home.png";
import undoImg from "assets/icons/undo.png";
import "./RestrictAccess.css";
import { AuthPaths } from "features/auth/auth";
import { useEffect } from "react";
import { checkPermission, getRole } from "helpers/auth.helpers";
import { useSelector } from "react-redux";

const RestrictAccess = ({ history, roles, children }) => {
  //  const { t } = useTranslation();
  const auth = useSelector((state) => state.auth);

  if (!auth.isSignedIn) {
    history.push(AuthPaths.LOGIN);
  }
  if (checkPermission(roles, auth?.role)) {
    return children;
  }

  return (
    // <Result
    //   status="403"
    //   title={t("default.restrictAccessTitle")}
    //   subTitle={t("default.restrictAccessText")}
    //   extra={
    //     <Link to="/">
    //       <Button type="primary">{t("default.notFoundBackHomeButton")}</Button>
    //     </Link>
    //   }
    // />
    <Result
      status="403"
      title="Quyền truy cập"
      subTitle="Xin lỗi, Nhân viên không đủ quyền để truy cập vào trang này"
      className="restrictAccess"
      extra={
        <div className="btns">
          <Button
            type="primary"
            shape="round"
            size={"large"}
            style={{
              width: "fitContent",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              paddingTop: "2.1rem",
              paddingBottom: "2.1rem",
              paddingLeft: "2.8rem",
              paddingRight: "2.8rem",
              background: "lightcoral",
            }}
            onClick={() => history.goBack()}
          >
            <img
              src={undoImg}
              alt=""
              style={{ height: "2.2rem", width: "2.2rem" }}
            />
            Quay lại
          </Button>
          <Button
            type="primary"
            shape="round"
            size={"large"}
            onClick={() => history.push(AuthPaths.HOME)}
            style={{
              width: "fitContent",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              paddingTop: "2.1rem",
              paddingBottom: "2.1rem",
              paddingLeft: "2.8rem",
              paddingRight: "2.8rem",
              background: "mediumslateblue",
            }}
          >
            <img
              src={homeImg}
              alt=""
              style={{ height: "2.5rem", width: "2.5rem" }}
            />
            Trang chủ
          </Button>
        </div>
      }
    />
  );
};

export default RestrictAccess;
