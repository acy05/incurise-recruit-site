import { ArrowUp, ChevronLeft, ChevronRight } from "lucide-react";
import "./interaction.css";

/** Directional help for navigation and detail rows, never a default button ornament. */
export function NavigationIcon({ direction = "forward" }: { direction?: "forward" | "back" | "up" }) {
  const Icon = direction === "back" ? ChevronLeft : direction === "up" ? ArrowUp : ChevronRight;
  return <span className="ss-navigation-icon" aria-hidden="true"><Icon size={18} strokeWidth={1.6} focusable="false"/></span>;
}
