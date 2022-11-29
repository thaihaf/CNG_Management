import { unwrapResult } from "@reduxjs/toolkit";
import { Spin } from "antd";
import { CODE_ERROR } from "constants/errors.constants";
import { updateError } from "features/auth/auth";
import { SupplierDetailsForm } from "features/supplier-manager/components";
import {
  getDebtSuppliers,
  getSupplierDetails,
} from "features/supplier-manager/supplierManager";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
export default function SupplierDetails() {
  const { supplierId } = useParams();

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dispatch(getSupplierDetails(supplierId))
      .then(unwrapResult)
      .then((res) => {
        dispatch(getDebtSuppliers())
          .then(() => {
            setIsLoading(false);
          });
      })
      .catch((err) => {
        setIsLoading(false);
      });
  }, [dispatch, supplierId]);

  return (
    <Spin spinning={isLoading}>
      <SupplierDetailsForm isCreateMode={false} />
    </Spin>
  );
}
