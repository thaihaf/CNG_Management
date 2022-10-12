import { unwrapResult } from "@reduxjs/toolkit";
import { Modal } from "antd";
import { LoadingSpinner } from "components";
import { EmployeeDetailsForm } from "features/employee-manager/components";
import {
     getEmployeeDetails,
     updateDataDetails,
} from "features/employee-manager/employeeManager";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation, useParams } from "react-router-dom";

import "./Profile.css";

export default function Profile() {
     const { id, createMode } = useSelector((state) => state.auth);

     const history = useHistory();
     const location = useLocation();
     const dispatch = useDispatch();

     const info = () => {
          Modal.info({
               title: "Your account dont have infomation details",
               content: (
                    <p style={{ color: "deeppink", textAlign: "center" }}>
                         Let some step to create info details
                    </p>
               ),
               onOk() {},
          });
     };

     useEffect(() => {
          dispatch(getEmployeeDetails(id))
               .then(unwrapResult)
               .catch((error) => {
                    if (!createMode) {
                        //  info();
                    }
               });
     }, [dispatch, id]);

     return <EmployeeDetailsForm />;
}
