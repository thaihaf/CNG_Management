import React, { Suspense } from "react";
import { BrowserRouter as Router } from "react-router-dom";

import { LoadingSpinner } from "components";
import RoutesApp from "routes/Routes";

import "antd/dist/antd.css";
import "./App.css";
import { Spin } from "antd";
function App() {
     const loadingTranslation = false;

     if (loadingTranslation) {
          return <Spin spinning={true} />;
     }

     return (
          <Suspense fallback={<Spin spinning={true} delay={50}/>}>
               <Router>
                    <RoutesApp />
               </Router>
          </Suspense>
     );
}

export default App;
