import { Suspense } from "react";
import { BrowserRouter as Router } from "react-router-dom";

import { LoadingSpinner } from "components";
import Routes from "routes/Routes";

function App() {
     const loadingTranslation = false;

     if (loadingTranslation) {
          return (
               <LoadingSpinner isFullScreen={true} text="Loading Admin Panel" />
          );
     }

     return (
          <Suspense fallback={<div>loading...</div>}>
               <Router>
                    <Routes />
               </Router>
          </Suspense>
     );
}

export default App;
