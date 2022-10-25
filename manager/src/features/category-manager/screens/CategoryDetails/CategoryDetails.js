import { unwrapResult } from "@reduxjs/toolkit";
import { Spin } from "antd";
import { CODE_ERROR } from "constants/errors.constants";
import { updateError } from "features/auth/auth";
import { CategoryDetailsForm } from "features/category-manager/commponents";
import { getCategoryDetails } from "features/category-manager/categoryManager";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
export default function CategoryDetails() {
     const { categoryId } = useParams();

     const dispatch = useDispatch();
     const [isLoading, setIsLoading] = useState(false);

     useEffect(() => {
          dispatch(getCategoryDetails(categoryId))
               .then(unwrapResult)
               .then(() => setIsLoading(false))
               .catch(() => {
                    dispatch(updateError(CODE_ERROR.ERROR_PROCESS));
               });
     }, [dispatch, categoryId]);

     return (
          <Spin spinning={isLoading}>
               <CategoryDetailsForm isCreateMode={false} />
          </Spin>
     );
}
