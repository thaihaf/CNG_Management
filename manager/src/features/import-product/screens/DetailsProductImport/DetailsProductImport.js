import React, { useEffect, useState } from "react";
import { ImportWrapper } from "features/import-product/components";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getProductImportDetails,
  updateProductImport,
} from "features/import-product/importProduct";
import { getWarehouses } from "features/warehouse-manager/warehouseManager";
import { getSuppliers } from "features/supplier-manager/supplierManager";
import { Spin } from "antd";

export default function DetailsProductImport() {
  const { importId } = useParams();
  const { productsImport } = useSelector((state) => state.productImport);

  const dispatch = useDispatch();

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    dispatch(getProductImportDetails(importId))
      .then(() => {
        dispatch(getWarehouses());
        dispatch(getSuppliers()).then((res) => {
          setIsLoading(false);
        });
      })
      .catch((err) => {});
  }, [dispatch, importId]);

  return (
    <Spin spinning={isLoading}>
      <ImportWrapper updateMode={true} />
    </Spin>
  );
}
