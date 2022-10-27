import React, { useEffect } from "react";
import { Button, Result } from "antd";
import "antd/dist/antd.css";
import { Link, useHistory } from "react-router-dom";
import { getIsLogin } from "helpers/auth.helpers";
import { AuthPaths } from "features/auth/auth";
// import { useTranslation } from "react-i18next";

const NotFound = () => {
     const history = useHistory();
     //  const { t } = useTranslation();
     useEffect(() => {
          const isLogin = getIsLogin();
          if (isLogin === false) {
               history.push(AuthPaths.LOGIN);
          }
     });

     return (
          <Result
               status="404"
               title="404"
               subTitle="Sorry, the page you visited does not exist."
               style={{ color: "black" }}
               extra={
                    <Link to="/">
                         <Button type="primary">Back Home</Button>
                    </Link>
               }
          />
     );
};

export default NotFound;
