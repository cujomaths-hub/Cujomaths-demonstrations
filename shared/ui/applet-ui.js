// Shared UI components for CDN-React + Babel applets.
// These components assume React is available globally (window.React).

import {
  getStoredThemeSetting,
  applyThemeSetting,
  attachSystemThemeListener,
} from "./theme.js";

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

/** Light / dark / follow system. Persists in localStorage (see theme.js). */
export function ThemeSelect({ id = "cujomaths-theme-select" } = {}) {
  const [mode, setMode] = React.useState(() => getStoredThemeSetting());
  React.useEffect(() => {
    applyThemeSetting(mode);
  }, [mode]);
  React.useEffect(() => {
    return attachSystemThemeListener(() => {});
  }, []);
  return React.createElement(
    "label",
    { className: "themeSelectWrap", htmlFor: id },
    React.createElement("span", { className: "tiny" }, "Theme"),
    React.createElement(
      "select",
      {
        id,
        value: mode,
        onChange: (e) => setMode(e.target.value),
        "aria-label": "Colour theme",
      },
      React.createElement("option", { value: "system" }, "System"),
      React.createElement("option", { value: "light" }, "Light"),
      React.createElement("option", { value: "dark" }, "Dark")
    )
  );
}

