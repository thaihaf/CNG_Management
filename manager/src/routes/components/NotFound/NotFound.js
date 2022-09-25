import { Button, Result } from "antd";
import "antd/dist/antd.css";
import { Link } from "react-router-dom";
// import { useTranslation } from "react-i18next";

const NotFound = () => {
     //  const { t } = useTranslation();
     return (
          // <Result
          //   icon={<QuestionCircleOutlined />}
          //   title={t("default.notFoundTitle")}
          //   subTitle={t("default.notFoundText")}
          // />
          <Result
               status="404"
               title="404"
               subTitle="Sorry, the page you visited does not exist."
               extra={
                    <Link to="/">
                         <Button type="primary">Back Home</Button>
                    </Link>
               }
          />
     );
};

export default NotFound;
