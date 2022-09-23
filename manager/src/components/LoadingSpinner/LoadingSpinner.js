import React from "react";

import { Typography, CircularProgress } from "@mui/material";

import cx from "classnames";
import styles from "./LoadingSpinner.module.scss";

const LoadingSpinner = ({ text, isFullScreen }) => {
     return (
          <div
               className={cx(
                    styles.container,
                    isFullScreen && styles.isFullScreen
               )}
          >
               {!!text && <Typography variant="h4" color={`white`}>{text}</Typography>}
               <CircularProgress size={25} color="info"/>
          </div>
     );
};

export default LoadingSpinner;
