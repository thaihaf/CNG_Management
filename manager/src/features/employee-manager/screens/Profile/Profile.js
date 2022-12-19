import { unwrapResult } from "@reduxjs/toolkit";
import { Modal } from "antd";
import { LoadingSpinner } from "components";
import { getAccountEmail } from "features/auth/auth";
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
  const { id } = useSelector((state) => state.auth);

  const [firstTime, setFirstTime] = useState(false);
  const dispatch = useDispatch();

  const info = () => {
    Modal.warn({
      title: "Tài khoản của bạn hiện chưa có thông tin",
      content: (
        <p style={{ color: "deeppink", textAlign: "center" }}>
          Làm theo một số bước và chọn Cập nhật thông tin
        </p>
      ),
      onOk() {},
    });
  };

  useEffect(() => {
    dispatch(getEmployeeDetails(id))
      .then(unwrapResult)
      .catch((error) => {
        setFirstTime(true);
        dispatch(getAccountEmail())
          .then(unwrapResult)
          .then(() => {
            dispatch(getAccountEmail());
          });
      });
  }, [dispatch, id]);

  useEffect(() => {
    if (firstTime) {
      info();
    }
  }, [firstTime]);

  return <EmployeeDetailsForm updateNew={true} />;
}
