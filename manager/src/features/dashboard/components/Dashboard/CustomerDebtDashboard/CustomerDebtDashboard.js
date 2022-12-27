import React from "react";
import ListTable from "./ListTable/ListTable";
import PieTable from "./PieTable/PieTable";

import "./CustomerDebtDashboard.css";
export default function CustomerDebtDashboard() {
  return (
    <div className="customer-debt-dashboard">
      <ListTable style={{ width: "60%" }} />
      <PieTable style={{ width: "40%" }} />
    </div>
  );
}
