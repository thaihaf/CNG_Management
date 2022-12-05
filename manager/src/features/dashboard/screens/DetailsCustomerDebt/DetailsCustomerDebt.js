import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getWarehouses } from "features/warehouse-manager/warehouseManager";
import { getSuppliers } from "features/supplier-manager/supplierManager";
import { Spin } from "antd";
import { getProductExportDetails } from "features/export-product/exportProduct";
import { unwrapResult } from "@reduxjs/toolkit";
import ExportWrapper from "features/export-product/components/ExportWrapper/ExportWrapper";
import { getCustomers } from "features/customer-manager/customerManager";
import { getCustomerDebtDetails } from "features/customer-debt/customerDebt";
import moment from "moment";
import { DetailsForm } from "features/customer-debt/components";

export default function DetailsCustomerDebt() {
  const { id } = useParams();

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    let startDate = moment().startOf("month").format("MM/DD/YYYY");
    let endDate = moment().endOf("month").format("MM/DD/YYYY");

    dispatch(
      getCustomerDebtDetails({ id: id, startDate: startDate, endDate: endDate })
    )
      .then(unwrapResult)
      .then((res) => {
        setIsLoading(false);
      });
  }, [dispatch, id]);

  return (
    <Spin spinning={isLoading}>
      <DetailsForm />
    </Spin>
  );
}
