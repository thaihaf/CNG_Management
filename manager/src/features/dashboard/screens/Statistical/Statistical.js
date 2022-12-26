import { Button, Tabs, Typography } from "antd";
import {
  DashboardByDay,
  DashboardByMonth,
  DashboardByYear,
} from "features/dashboard/components";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Excel } from "antd-table-saveas-excel";

import "./Statistical.css";
import { useSelector } from "react-redux";
import {
  dashboardColumnsExport,
  dayDashboardColumnsExport,
  dayExport,
  monthDashboardColumnsExport,
  monthExport,
  yearDashboardColumnsExport,
  yearExport,
} from "features/dashboard/constants/dashboard.column";
import { ContainerOutlined } from "@ant-design/icons";
const { Title } = Typography;

export default function Statistical() {
  const [activeTab, setActiveTab] = useState();

  return (
    <div className="statistical">
      <div className="top">
        <Title level={3} style={{ marginBottom: 0, marginRight: "auto" }}>
          Thống kê
        </Title>
      </div>

      <Tabs
        activeKey={activeTab}
        onTabClick={(key) => setActiveTab(key)}
        style={{
          boxShadow: "rgba(0, 0, 0, 0.15) 0px 2px 8px",
          borderRadius: "2rem",
          marginTop: "2rem",
        }}
        items={[
          {
            label: `Thống kê theo ngày`,
            key: `dashboardByDay`,
            children: <DashboardByDay />,
          },
          {
            label: `Thống kê theo tháng`,
            key: `dashboardByMonth`,
            children: <DashboardByMonth />,
          },
          {
            label: `Thống kê theo năm`,
            key: `dashboardByYear`,
            children: <DashboardByYear />,
          },
        ]}
      />
    </div>
  );
}
