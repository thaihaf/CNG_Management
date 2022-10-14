import { unwrapResult } from "@reduxjs/toolkit";
import { LoadingSpinner } from "components";
import { CODE_ERROR } from "constants/errors.constants";
import { updateError } from "features/auth/auth";
import { SupplierDetailsForm } from "features/supplier-manager/components";
import { getSupplierDetails } from "features/supplier-manager/supplierManager";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";

export default function SupplierDetails() {
     const { supplierId } = useParams();

     const history = useHistory();
     const location = useLocation();
     const dispatch = useDispatch();
     const [isLoading, setIsLoading] = useState(false);

     useEffect(() => {
          dispatch(getSupplierDetails(supplierId))
               .then(unwrapResult)
               .then(() => setIsLoading(false))
               .catch(() => {
                    dispatch(updateError(CODE_ERROR.ERROR_PROCESS));
               });
     }, [dispatch, supplierId]);

     if (isLoading) {
          return <LoadingSpinner isFullscreen />;
     }
     return <SupplierDetailsForm isCreateMode={false}/>;
}
