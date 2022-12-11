import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Spin } from "antd";
import { unwrapResult } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import { getSupplierDebtDetails } from "features/supplier-debt/supplierDebt";
import { DetailsForm } from "features/supplier-debt/components";

export default function DetailsSupplierDebt() {
  const { id } = useParams();

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    let startDate = dayjs().startOf("month").format("MM/DD/YYYY");
    let endDate = dayjs().endOf("month").format("MM/DD/YYYY");

    dispatch(
      getSupplierDebtDetails({ id: id, startDate: startDate, endDate: endDate })
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
