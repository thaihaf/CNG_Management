import React from "react";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { Input, Form, Typography, Statistic, Modal } from "antd";
import { updateProductImport } from "features/import-product/importProduct";
import { useDispatch, useSelector } from "react-redux";
import "./StatisticGroups.css";

import totalQuantityImg from "assets/gif/calculator.gif";
import totalSquareMeterImg from "assets/gif/squareMeter.gif";
import totalCostImg from "assets/gif/purse.gif";

export default function StatisticGroups({ updateMode }) {
  const dispatch = useDispatch();

  return (
    <div className="statistic">
      <div className="statistic-item" style={{ backgroundColor: "#e5ffe5" }}>
        <div
          className="statistic-icon"
          style={{ backgroundColor: "darkseagreen" }}
        >
          <img src={totalQuantityImg} alt="" />
        </div>
        <Form.Item name={"totalQuantityImport"} initialValue={0}>
          <Statistic title="Total Quantity Box" />
        </Form.Item>
      </div>

      <div
        className="statistic-item"
        style={{ backgroundColor: "rgb(226 245 255)" }}
      >
        <div className="statistic-icon" style={{ backgroundColor: "#15AFFF" }}>
          <img src={totalSquareMeterImg} alt="" />
        </div>
        <Form.Item name={"totalSquareMeterImport"} initialValue={0}>
          <Statistic title="Total Square Meter (m2)" precision={2} />
        </Form.Item>
      </div>

      <div
        className="statistic-item"
        style={{ backgroundColor: "rgb(255 239 235)" }}
      >
        <div className="statistic-icon" style={{ backgroundColor: "#FE6A40" }}>
          <img src={totalCostImg} alt="" />
        </div>
        <Form.Item name={"totalCostImport"} initialValue={0}>
          <Statistic title="Total Cost (vnđ)" precision={2} />
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
            <img src={totalCostImg} alt="" />
          </div>
          <Form.Item name={"statusImport"} initialValue={0}>
            <Statistic title="Status" />
          </Form.Item>
        </div>
      )}
    </div>
  );
}
