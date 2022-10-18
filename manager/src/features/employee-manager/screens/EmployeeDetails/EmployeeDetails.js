import { unwrapResult } from "@reduxjs/toolkit";
import { Spin } from "antd";
import { CODE_ERROR } from "constants/errors.constants";
import { updateError } from "features/auth/auth";
import { EmployeeDetailsForm } from "features/employee-manager/components";
import { getEmployeeDetails } from "features/employee-manager/employeeManager";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";

export default function EmployeeDetails() {
     const { employeeId } = useParams();

     const dispatch = useDispatch();
     const [isLoading, setIsLoading] = useState(true);

     useEffect(() => {
          dispatch(getEmployeeDetails(employeeId))
               .then(unwrapResult)
               .then(() => setIsLoading(false))
               .catch(() => {
                    dispatch(updateError(CODE_ERROR.ERROR_PROCESS));
               });
     }, [dispatch, employeeId]);

     return (
          <Spin spinning={isLoading}>
               <EmployeeDetailsForm isCreateMode={false} />
          </Spin>
     );
}
