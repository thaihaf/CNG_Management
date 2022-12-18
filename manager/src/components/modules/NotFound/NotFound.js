import React, { useEffect } from "react";
import { Button, Result } from "antd";

// import "antd/dist/antd.css";

import { Link, useHistory } from "react-router-dom";
import { getIsLogin } from "helpers/auth.helpers";
import { AuthPaths } from "features/auth/auth";
// import { useTranslation } from "react-i18next";

const NotFound = () => {
  //  const { t } = useTranslation();

  console.log("first");

  return (
    <Result
      status="404"
      title="404"
      subTitle="Xin lỗi, trang này hiện không tồn tại trong hệ thống"
      style={{ color: "black !important" }}
      extra={
        <Link to="/">
          <Button type="primary">Trở về Trang chủ</Button>
        </Link>
      }
    />
  );
};

export default NotFound;
