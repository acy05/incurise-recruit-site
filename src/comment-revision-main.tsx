import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import CommentRevisionApp from "./CommentRevisionApp";
import "./comment-revision.css";

createRoot(document.getElementById("comment-revision-root")!).render(
  <StrictMode>
    <CommentRevisionApp />
  </StrictMode>,
);
