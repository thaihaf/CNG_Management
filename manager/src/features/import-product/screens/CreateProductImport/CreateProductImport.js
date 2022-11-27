import React, { useEffect, useState } from "react";
import { ImportWrapper } from "features/import-product/components";
import { useDispatch, useSelector } from "react-redux";
import { getSuppliers } from "features/supplier-manager/supplierManager";
import { getWarehouses } from "features/warehouse-manager/warehouseManager";
import { Spin } from "antd";
import { clearProductImport, updateProductImport } from "features/import-product/importProduct";

export default function CreateProductImport() {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    dispatch(getWarehouses());
    dispatch(getSuppliers()).then((res) => {
       dispatch(clearProductImport([]));
      setIsLoading(false);
    });
  }, [dispatch]);

  return (
    <Spin spinning={isLoading}>
      <ImportWrapper updateMode={false} />
    </Spin>
  );
}
