import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingSpinner } from "components";
import { CODE_ERROR } from "constants/errors.constants";
import { updateError } from "features/auth/auth";
import { EmployeeDetailsForm } from "features/employee-manager/components";
import { getEmployeeDetails } from "features/employee-manager/employeeManager";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";

export default function EmployeeDetails() {
     const { employeeId } = useParams();

     const history = useHistory();
     const location = useLocation();
     const dispatch = useDispatch();
     const [isLoading, setIsLoading] = useState(false);

     useEffect(() => {
          dispatch(getEmployeeDetails(employeeId))
               .then(unwrapResult)
               .then(() => setIsLoading(false))
               .catch(() => {
                    dispatch(updateError(CODE_ERROR.ERROR_PROCESS));
               });
     }, [dispatch, employeeId]);

     if (isLoading) {
          return <LoadingSpinner isFullscreen />;
     }
     return <EmployeeDetailsForm isCreateMode={false}/>;
}
