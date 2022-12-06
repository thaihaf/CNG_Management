import { Tabs, Typography } from "antd";
import {
  DashboardByDay,
  DashboardByMonth,
  DashboardByYear,
} from "features/dashboard/components";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import "./Dashboard.css";
const { Title } = Typography;

export default function Dashboard() {
  const history = useHistory();

  const [activeTab, setActiveTab] = useState();
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div>
      <div className="actions-group">
        <Title level={3} style={{ marginBottom: 0, marginRight: "auto" }}>
          Thống kê
        </Title>
      </div>

      <Tabs
        defaultActiveKey={`table`}
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
