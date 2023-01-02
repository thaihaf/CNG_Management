import React from "react";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Input, Form, Typography, Statistic, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { motion } from "framer-motion/dist/framer-motion";
import "./StatisticGroups.css";

import debt2Img from "assets/icons/debt2.png";
import debtImg from "assets/icons/debt.png";
import packageImg from "assets/icons/package.png";
import statusImg from "assets/icons/status.png";

export default function StatisticGroups() {
  return (
    <div className="statistic">
      <motion.div
        className="statistic-item"
        style={{ backgroundColor: "#e5ffe5" }}
        animate={{ opacity: [0, 1], x: [-100, 0] }}
        exit={{ opacity: [1, 0] }}
        transition={{ duration: 1 }}
      >
        <div
          className="statistic-icon"
          style={{ backgroundColor: "darkseagreen" }}
        >
          <img src={debt2Img} alt="" />
        </div>
        <Form.Item name={"debtAtBeginningPeriod"} initialValue={0}>
          <Statistic title="Dư nợ đầu kỳ (VND)" precision={0} />
        </Form.Item>
      </motion.div>

      <motion.div
        className="statistic-item"
        style={{ backgroundColor: "rgb(226 245 255)" }}
        animate={{ opacity: [0, 1], x: [100, 0] }}
        exit={{ opacity: [1, 0] }}
        transition={{ duration: 1 }}
      >
        <div className="statistic-icon" style={{ backgroundColor: "#15AFFF" }}>
          <img src={debtImg} alt="" />
        </div>
        <Form.Item name={"debtAtEndPeriod"} initialValue={0}>
          <Statistic title="Dư nợ cuối kỳ (VND)" precision={0} />
        </Form.Item>
      </motion.div>
    </div>
  );
}
