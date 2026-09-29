import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import IsaacCompleteLanding from "./IsaacCompleteLanding";

createRoot(document.getElementById("web-production-root")!).render(
  <StrictMode>
    <IsaacCompleteLanding />
  </StrictMode>,
);
