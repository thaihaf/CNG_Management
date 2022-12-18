import React from "react";
import { Spin } from "antd";
import RestrictAccess from "components/layouts/RestrictAccess/RestrictAccess";

export default function Spiner({ children, isLoading, errorCode }) {
  if (errorCode) {
    switch (errorCode) {
      case 403: // unauthorized
        return <RestrictAccess />;
        break;
      case 404: // not found
        break;
    }
  }
  return <Spin spinning={isLoading}>{children}</Spin>;
}
