import { Button, Tabs, Typography } from "antd";
import {
  DashboardByDay,
  DashboardByMonth,
  DashboardByYear,
} from "features/dashboard/components";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { Excel } from "antd-table-saveas-excel";

import "./Dashboard.css";
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
const { Title } = Typography;

export default function Dashboard() {
  const history = useHistory();
  const { listDashboardByDay, month, year } = useSelector(
    (state) => state.dashboard.dashboardByDay
  );
  const { listDashboardByMonth, year2 } = useSelector(
    (state) => state.dashboard.dashboardByMonth
  );
  const { listDashboardByYear, startYear, endYear } = useSelector(
    (state) => state.dashboard.dashboardByYear
  );
  const [activeTab, setActiveTab] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const handleExportExcel = () => {
    const excel = new Excel();

    excel.setTHeadStyle({
      h: "center",
      v: "center",
      fontName: "SF Mono",
    });
    excel.setTBodyStyle({
      h: "center",
      v: "center",
      fontName: "SF Mono",
    });

    excel.addSheet("Thống kê theo ngày");
    excel.drawCell(0, 0, {
      hMerge: 8,
      vMerge: 3,
      value:
        !month || !year
          ? "Vui lòng chọn lại thống kê theo ngày và Xuất lại"
          : `Thống kê theo ngày trong tháng ${month}/${year}`,
      style: {
        bold: true,
        background: "FFC000",
        fontSize: 25,
        h: "center",
        v: "center",
      },
    });
    excel.addColumns(dayDashboardColumnsExport);
    excel.addDataSource(listDashboardByDay);

    excel.addSheet("Thống kê theo tháng");
    excel.drawCell(0, 0, {
      hMerge: 8,
      vMerge: 3,
      value: year2
        ? `Thống kê theo tháng trong năm ${year2}`
        : "Vui lòng chọn Thống kê theo tháng và Xuất lại",
      style: {
        bold: true,
        background: "FFC000",
        fontSize: 25,
        h: "center",
        v: "center",
      },
    });
    excel.addColumns(monthDashboardColumnsExport);
    excel.addDataSource(listDashboardByMonth);

    excel.addSheet("Thống kê theo năm");
    excel.drawCell(0, 0, {
      hMerge: 8,
      vMerge: 3,
      value:
        !startYear || !endYear
          ? "Vui lòng chọn Thống kê theo năm và Xuất lại"
          : `Thống kê theo năm : ${startYear} - ${endYear}`,
      style: {
        bold: true,
        background: "FFC000",
        fontSize: 25,
        h: "center",
        v: "center",
      },
    });
    excel.addColumns(yearDashboardColumnsExport);
    excel.addDataSource(listDashboardByYear);

    excel.saveAs("Thống kê.xlsx");
  };

  return (
    <div className="dashboard">
      <div className="top">
        <Title level={3} style={{ marginBottom: 0, marginRight: "auto" }}>
          Thống kê
        </Title>

        <Button
          type="primary"
          shape={"round"}
          size={"large"}
          onClick={() => handleExportExcel()}
          disabled={
            listDashboardByDay.length === 0 &&
            listDashboardByMonth.length === 0 &&
            listDashboardByYear.length === 0
              ? true
              : false
          }
        >
          XUẤT EXCEL
        </Button>
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
