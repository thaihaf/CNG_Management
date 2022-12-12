import React, { Suspense, useEffect } from "react";

import { LoadingSpinner } from "components";
import RoutesApp from "routes/Routes";

// import "antd/dist/antd.css";


import "./App.css";
import { Spin } from "antd";
import { useDispatch } from "react-redux";
import { getProvinces } from "features/provinces/provinces";

function App() {
  const dispatch = useDispatch();
  //  const loadingTranslation = false;

  //  if (loadingTranslation) {
  //       return <Spin spinning={true} />;
  //  }

  useEffect(() => {
    dispatch(getProvinces());
  }, [dispatch]);

  return (
    <Suspense
      fallback={
        <Spin
          spinning={true}
          delay={50}
          style={{
            position: "fixed",
            left: "50%",
            top: "50%",
            backgroundColor: "transparent",
          }}
        />
      }
    >
        <RoutesApp />
    </Suspense>
  );
}

export default App;
