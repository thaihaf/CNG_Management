import React from "react";

import { Typography, CircularProgress } from "@mui/material";

import cx from "classnames";

const LoadingSpinner = ({ text, isFullScreen }) => {
     return (
          <div className="container isFullScreen">
               {!!text && (
                    <Typography variant="h4" color={`white`}>
                         {text}
                    </Typography>
               )}
               <CircularProgress size={25} color="info" />
          </div>
     );
};

export default LoadingSpinner;
