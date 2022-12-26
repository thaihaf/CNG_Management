import React from "react";
import ListTable from "./ListTable/ListTable";
import PieTable from "./PieTable/PieTable";

import "./SupplierDebtDashboard.css";

export default function SupplierDebtDashboard() {
  return (
    <div className="supplier-debt-dashboard">
      <ListTable style={{width : "70%"}}/>
      <PieTable style={{width : "30%"}}/>
    </div>
  );
}
