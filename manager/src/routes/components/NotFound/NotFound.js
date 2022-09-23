import { QuestionCircleOutlined } from "@ant-design/icons";
import { Result } from "antd";
import { useTranslation } from "react-i18next";

const NotFound = () => {
  const { t } = useTranslation();
  return (
    <Result
      icon={<QuestionCircleOutlined />}
      title={t("default.notFoundTitle")}
      subTitle={t("default.notFoundText")}
    />
  );
};

export default NotFound;