import React from "react";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Input, Form, Typography, Statistic, Modal } from "antd";
import { useDispatch, useSelector } from "react-redux";
import "./StatisticGroups.css";

import boxesImg from "assets/icons/boxes.png";
import squareMeterImg from "assets/icons/squareMeter.png";
import packageImg from "assets/icons/package.png";
import statusImg from "assets/icons/status.png";

export default function StatisticGroups({ updateMode }) {
  const dispatch = useDispatch();

  return (
    <div className="statistic">
      <div className="statistic-item" style={{ backgroundColor: "#e5ffe5" }}>
        <div
          className="statistic-icon"
          style={{ backgroundColor: "darkseagreen" }}
        >
          <img src={boxesImg} alt="" />
        </div>
        <Form.Item name={"totalQuantityExport"} initialValue={0}>
          <Statistic title="Tổng số lượng hộp" />
        </Form.Item>
      </div>

      <div
        className="statistic-item"
        style={{ backgroundColor: "rgb(226 245 255)" }}
      >
        <div className="statistic-icon" style={{ backgroundColor: "#15AFFF" }}>
          <img src={squareMeterImg} alt="" />
        </div>
        <Form.Item name={"totalSquareMeterExport"} initialValue={0}>
          <Statistic title="Tổng số mét vuông (m2)" precision={2} />
        </Form.Item>
      </div>

      <div
        className="statistic-item"
        style={{ backgroundColor: "rgb(255 239 235)" }}
      >
        <div className="statistic-icon" style={{ backgroundColor: "#FE6A40" }}>
          <img src={packageImg} alt="" />
        </div>
        <Form.Item name={"totalExportOrderPrice"} initialValue={0}>
          <Statistic title="Tổng giá (vnđ)" precision={0} />
        </Form.Item>
      </div>

      {updateMode && (
        <div
          className="statistic-item"
          style={{ backgroundColor: "rgb(255 239 235)" }}
        >
          <div
            className="statistic-icon"
            style={{ backgroundColor: "#FE6A40" }}
          >
            <img src={statusImg} alt="" />
          </div>
          <Form.Item name={"statusExport"} initialValue={0}>
            <Statistic title="Trạng thái đơn" />
          </Form.Item>
        </div>
      )}
    </div>
  );
}
