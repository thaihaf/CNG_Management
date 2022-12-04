import React from "react";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Input, Form, Typography, Statistic, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import "./StatisticGroups.css";

import debt2Img from "assets/icons/debt2.png";
import debtImg from "assets/icons/debt.png";
import packageImg from "assets/icons/package.png";
import statusImg from "assets/icons/status.png";

export default function StatisticGroups() {
  return (
    <div className="statistic">
      <div className="statistic-item" style={{ backgroundColor: "#e5ffe5" }}>
        <div
          className="statistic-icon"
          style={{ backgroundColor: "darkseagreen" }}
        >
          <img src={debt2Img} alt="" />
        </div>
        <Form.Item name={"debtAtBeginningPeriod"} initialValue={0}>
          <Statistic title="Số nợ đầu kỳ (vnđ)" precision={0} />
        </Form.Item>
      </div>

      <div
        className="statistic-item"
        style={{ backgroundColor: "rgb(226 245 255)" }}
      >
        <div className="statistic-icon" style={{ backgroundColor: "#15AFFF" }}>
          <img src={debtImg} alt="" />
        </div>
        <Form.Item name={"debtAtEndPeriod"} initialValue={0}>
          <Statistic title="Số nợ cuối kỳ (vnđ)" precision={0} />
        </Form.Item>
      </div>
    </div>
  );
}
