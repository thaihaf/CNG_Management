import { Result } from "antd";
import { Button } from "@mui/material";
// import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const RestrictAccess = () => {
     //  const { t } = useTranslation();
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
               title="403"
               subTitle="Sorry, you are not authorized to access this page."
               extra={
                    <Link to="/">
                         <Button type="primary">Back Home</Button>
                    </Link>
               }
          />
     );
};

export default RestrictAccess;
