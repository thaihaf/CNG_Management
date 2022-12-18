import React from "react";

import { Typography, CircularProgress } from "@mui/material";

import cx from "classnames";
import "./LoadingSpinner.css";
const LoadingSpinner = ({ text, isFullScreen }) => {
  return (
    <div className={cx("container", isFullScreen && "isFullScreen")}>
      {!!text && (
        <Typography variant="h4" color={`white`}>
          {text}
        </Typography>
      )}
      <CircularProgress size={25} style={{ color: "$fff" }} />
    </div>
  );
};

export default LoadingSpinner;
