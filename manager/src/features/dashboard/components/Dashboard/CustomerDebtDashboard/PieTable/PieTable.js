import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Chart from "react-apexcharts";
import { useState } from "react";
import { useEffect } from "react";
import { getCustomerDebtDashboard } from "features/dashboard/dashboard";

import "./PieTable.css";
import { Statistic } from "antd";

export default function PieTable() {
  const { series, data } = useSelector(
    (state) => state.dashboard.dashboard.customerDebt
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCustomerDebtDashboard());
  }, [dispatch]);

  return (
    <div className="customer-debt-pie">
      <Chart
        options={{
          chart: {
            height: 250,
            type: "radialBar",
          },
          plotOptions: {
            radialBar: {
              hollow: {
                size: "60%",
              },
            },
          },
          labels: [`Tỷ lệ thanh toán / Doanh số`],
        }}
        series={series}
        type="radialBar"
        height={350}
      />

      <div className="left">
        <div className="totalDebt">
          <div className="title">Tổng tiền bán:</div>
          <Statistic precision={0} value={data.totalDebt} suffix={"vnđ"} />
        </div>
        <div className="totalPayment">
          <div className="title">Đã thanh toán:</div>
          <Statistic precision={0} value={data.totalPayment} suffix={"vnđ"} />
        </div>
      </div>
    </div>
  );
}
