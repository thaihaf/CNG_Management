import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { Spin } from "antd";
import { unwrapResult } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import queryString from "query-string";
import { getSupplierDebtDetails } from "features/supplier-debt/supplierDebt";
import { DetailsForm } from "features/supplier-debt/components";

export default function DetailsSupplierDebt() {
  const { id } = useParams();

  const dispatch = useDispatch();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    const query = queryString.parse(location.search);
    if (query.page) {
      query.page = query.page - 1;
    }
    let startDate = dayjs().startOf("month").format("DD/MM/YYYY");
    let endDate = dayjs().endOf("month").format("DD/MM/YYYY");

    const params = { startDate: startDate, endDate: endDate, ...query };

    dispatch(getSupplierDebtDetails({ id: id, params: params }))
      .then(unwrapResult)
      .then((res) => {
        setIsLoading(false);
      });
  }, [dispatch, id, location]);

  return <DetailsForm isLoading={isLoading} />;
}
