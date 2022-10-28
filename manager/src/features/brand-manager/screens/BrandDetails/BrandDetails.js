import { unwrapResult } from "@reduxjs/toolkit";
import { Spin } from "antd";
import { CODE_ERROR } from "constants/errors.constants";
import { updateError } from "features/auth/auth";
import { BrandDetailsForm } from "features/brand-manager/components";
import { getBrandDetails } from "features/brand-manager/brandManager";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
export default function BrandDetails() {
     const { brandId } = useParams();

     const dispatch = useDispatch();
     const [isLoading, setIsLoading] = useState(false);

     useEffect(() => {
          dispatch(getBrandDetails(brandId))
               .then(unwrapResult)
               .then(() => setIsLoading(false))
               .catch(() => {
                    dispatch(updateError(CODE_ERROR.ERROR_PROCESS));
               });
     }, [dispatch, brandId]);

     return (
          <Spin spinning={isLoading}>
               <BrandDetailsForm isCreateMode={false} />
          </Spin>
     );
}
