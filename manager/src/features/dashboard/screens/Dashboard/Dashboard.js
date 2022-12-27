import { Button, Tabs, Typography } from "antd";

import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Excel } from "antd-table-saveas-excel";
import helloImg from "assets/icons/hello.png";
import "./Dashboard.css";
import { useSelector } from "react-redux";

import { ContainerOutlined } from "@ant-design/icons";
import { ProfitDashboard, TotalDashboard } from "features/dashboard/components";
import CustomerDebtDashboard from "features/dashboard/components/Dashboard/CustomerDebtDashboard/CustomerDebtDashboard";
import SupplierDebtDashboard from "features/dashboard/components/Dashboard/SupplierDebtDashboard/SupplierDebtDashboard";
const { Title } = Typography;

export default function Dashboard() {
  return (
    <div className="dashboard">
      <div className="top">
        <div>
          <Title
            level={3}
            style={{
              marginBottom: "1rem",
              marginRight: "auto",
              display: "flex",
              alignItems: "flex-end",
            }}
          >
            Xin chào
            <img
              src={helloImg}
              alt="hello"
              style={{ width: "3.5rem", heigh: "3.5rem", marginLeft: "1rem" }}
            />
          </Title>
          <div style={{ color: "gray" }}>Kiểm tra xem có gì mới nào!</div>
        </div>
      </div>

      <ProfitDashboard />
      <CustomerDebtDashboard />
      <SupplierDebtDashboard />
    </div>
  );
}
