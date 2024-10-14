import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from 'react-router-dom';

import App from "./App";

const rootElement = document.getElementById("root");
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <App />
  </StrictMode>
);

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter basename="/forward-inverse-kinematics">
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
