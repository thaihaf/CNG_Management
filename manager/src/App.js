import React, { Suspense } from "react";
import { BrowserRouter as Router } from "react-router-dom";

import { LoadingSpinner } from "components";
import RoutesApp from "routes/Routes";

import "antd/dist/antd.css";
import "./App.css";
function App() {
     const loadingTranslation = false;

     if (loadingTranslation) {
          return (
               <LoadingSpinner isFullScreen={true} text="Loading Admin Panel" />
          );
     }

     return (
          <Suspense
               fallback={
                    <LoadingSpinner
                         isFullScreen={true}
                         text="Loading Admin Panel"
                    />
               }
          >
               <Router>
                    <RoutesApp />
               </Router>
          </Suspense>
     );
}

export default App;
