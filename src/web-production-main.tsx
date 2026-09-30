import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import StudioLanding from "./StudioLanding";

createRoot(document.getElementById("web-production-root")!).render(
  <StrictMode>
    <StudioLanding />
  </StrictMode>,
);
