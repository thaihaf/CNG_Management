import { unwrapResult } from "@reduxjs/toolkit";
import { Spin } from "antd";
import { CODE_ERROR } from "constants/errors.constants";
import { updateError } from "features/auth/auth";
import { WarehouseDetailsForm } from "features/warehouse-manager/components";
import { getWarehouseDetails } from "features/warehouse-manager/warehouseManager";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
export default function WarehouseDetails() {
     const { warehouseId } = useParams();

     const dispatch = useDispatch();
     const [isLoading, setIsLoading] = useState(true);

     useEffect(() => {
          dispatch(getWarehouseDetails(warehouseId))
               .then(unwrapResult)
               .then(() => setIsLoading(false))
               .catch(() => {
                    dispatch(updateError(CODE_ERROR.ERROR_PROCESS));
               });
     }, [dispatch, warehouseId]);

     return (
          <Spin spinning={isLoading}>
               <WarehouseDetailsForm isCreateMode={false} />
          </Spin>
     );
}
