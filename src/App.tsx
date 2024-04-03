// App.js
import React, { Suspense, lazy, useEffect, useState } from "react";
import Image from "./assets/sample.jpg";

const Component1 = lazy(() => import("./Sample"));
import "./App.scss";
const App = () => {
  const [isloading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 3000);
  }, []);

  return (
    <div>
      {!isloading && (
        <Suspense fallback={<div>Loading...</div>}>
          <Component1 />
        </Suspense>
      )}
      <img src={Image} width={500} height={500} />
    </div>
  );
};

export default App;
