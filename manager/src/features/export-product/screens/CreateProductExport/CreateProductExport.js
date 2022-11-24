import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getSuppliers } from "features/supplier-manager/supplierManager";
import { getWarehouses } from "features/warehouse-manager/warehouseManager";
import { Spin } from "antd";
import {
  clearProductExport,
  updateProductExport,
} from "features/export-product/exportProduct";
import ExportWrapper from "features/export-product/components/ExportWrapper/ExportWrapper";
import { getCustomers } from "features/customer-manager/customerManager";

export default function CreateProductExport() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    dispatch(getWarehouses());
    dispatch(getCustomers()).then((res) => {
      dispatch(clearProductExport());
      setIsLoading(false);
    });
  }, [dispatch]);

  return (
    <Spin spinning={isLoading}>
      <ExportWrapper updateMode={false} />
    </Spin>
  );
}
