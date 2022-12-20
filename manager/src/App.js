import React, { Suspense, useEffect } from "react";

import { LoadingSpinner } from "components";
import RoutesApp from "routes/Routes";

// import "antd/dist/antd.css";

import "./App.css";
import { Spin } from "antd";
import { useDispatch } from "react-redux";
import { getProvinces } from "features/provinces/provinces";

import snowImg from "assets/icons/snow.png";
import Snowfall from "react-snowfall";

const snowFlake = document.createElement("img");
snowFlake.src = snowImg;
const images = [snowFlake];

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
      {/* <Snowfall
        style={{ position: "fixed", width: "100vw", height: "100vh" }}
        snowflakeCount={5}
        radius={[10, 20]}
        speed={[0.5, 2.5]}
        wind={[-0.5, 2]}
        images={images}
        rotationSpeed={[-1, 1]}
      /> */}
    </Suspense>
  );
}

export default App;
