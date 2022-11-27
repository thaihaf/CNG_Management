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

export default function DetailsProductExport() {
  const { exportId } = useParams();

  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    dispatch(getProductExportDetails(exportId))
      .then(unwrapResult)
      .then((res) => {
        dispatch(getWarehouses());
        dispatch(getCustomers()).then(() => {
          setIsLoading(false);
        });
      })
      .catch((err) => {});
  }, [dispatch, exportId]);

  return (
    <Spin spinning={isLoading}>
      <ExportWrapper updateMode={true} />
    </Spin>
  );
}
