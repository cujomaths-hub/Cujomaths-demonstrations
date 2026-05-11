// Shared UI components for CDN-React + Babel applets.
// These components assume React is available globally (window.React).

const React = window.React;

export function InstructionsDetails({
  title = "How to use",
  defaultOpen = false,
  children,
}) {
  return React.createElement(
    "details",
    { className: "details", open: defaultOpen || undefined },
    React.createElement("summary", { className: "detailsSummary" }, title),
    React.createElement("div", { className: "detailsBody" }, children)
  );
}

export function TeacherModeToggle({ value, onChange }) {
  return React.createElement(
    "button",
    {
      type: "button",
      className: value ? "toggleButton toggleButtonActive" : "toggleButton",
      onClick: () => onChange(!value),
      "aria-pressed": value ? "true" : "false",
      title: "Show/hide teacher resources on this page",
    },
    value ? "Teacher mode: On" : "Teacher mode: Off"
  );
}

