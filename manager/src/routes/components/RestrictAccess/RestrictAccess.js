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
               subTitle="Xin lỗi, bạn không đủ quyền để truy cập vào trang này"
               extra={
                    <Link to="/">
                         <Button type="primary">Trở về Trang chủ</Button>
                    </Link>
               }
          />
     );
};

export default RestrictAccess;
