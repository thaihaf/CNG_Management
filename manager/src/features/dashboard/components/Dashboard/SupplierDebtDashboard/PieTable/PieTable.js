import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Chart from "react-apexcharts";
import { useState } from "react";
import { useEffect } from "react";
import { getSupplierDebtDashboard } from "features/dashboard/dashboard";
import { Statistic } from "antd";

import "./PieTable.css";

export default function PieTable() {
  const { series,data } = useSelector(
    (state) => state.dashboard.dashboard.supplierDebt
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSupplierDebtDashboard());
  }, [dispatch]);

  return (
    <div className="supplier-debt-pie">
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
          labels: ["Số tiền thanh toán / Số tiền nhập"],
        }}
        series={series}
        type="radialBar"
        height={350}
      />

      <div className="left">
        <div className="totalDebt">
          <div className="title">Tổng tiền nhập:</div>
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
