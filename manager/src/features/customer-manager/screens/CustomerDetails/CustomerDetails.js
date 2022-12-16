import { unwrapResult } from "@reduxjs/toolkit";
import { Spin } from "antd";
import { CODE_ERROR } from "constants/errors.constants";
import { updateError } from "features/auth/auth";
import { CustomerDetailsForm } from "features/customer-manager/components";
import {
  getCustomerDetails,
  getDebtCustomers,
} from "features/customer-manager/customerManager";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import queryString from "query-string";
import { useLocation, useParams } from "react-router-dom";

export default function CustomerDetails() {
  const { customerId } = useParams();

  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    dispatch(getCustomerDetails(customerId))
      .then(unwrapResult)
      .then(() => {
        setIsLoading(false);
      });
  }, [dispatch, customerId]);

  return (
    <Spin spinning={isLoading}>
      <CustomerDetailsForm isCreateMode={false} />
    </Spin>
  );
}
