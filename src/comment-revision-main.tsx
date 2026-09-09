import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import CommentRevisionApp from "./CommentRevisionApp";
import "./comment-revision.css";
import "./comment-revision-polish.css";
import "./comment-revision-responsive.css";

createRoot(document.getElementById("comment-revision-root")!).render(
  <StrictMode>
    <CommentRevisionApp />
  </StrictMode>,
);
