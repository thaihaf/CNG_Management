import React, { useEffect, useState } from "react";

import { ProductDetailsForm } from "features/product-manager/components";
import { getDetailsProduct } from "features/product-manager/productManager";

import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { CODE_ERROR } from "constants/errors.constants";
import { updateError } from "features/auth/auth";
import { unwrapResult } from "@reduxjs/toolkit";
import { Spin } from "antd";

export default function ProductDetails() {
     const { productId } = useParams();

     const dispatch = useDispatch();
     const [isLoading, setIsLoading] = useState(true);

     useEffect(() => {
          dispatch(getDetailsProduct(productId))
               .then(unwrapResult)
               .then(() => setIsLoading(false))
               .catch(() => {
                    dispatch(updateError(CODE_ERROR.ERROR_PROCESS));
               });
     }, [dispatch, productId]);

     return (
          <Spin spinning={isLoading}>
               <ProductDetailsForm updateMode={true} />
          </Spin>
     );
}
