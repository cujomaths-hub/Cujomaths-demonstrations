/**
 * Reusable scaffolded-practice pieces for CDN React applets (window.React).
 * ScaffoldedStepList renders ordered steps; optional `when` skips a step.
 */

const React = window.React;

/** Single-line or equals-prefixed text step with optional feedback when `checked`. */
export function StepInput({
  title,
  prompt,
  hint,
  value,
  onChange,
  placeholder,
  checked,
  correct,
  supported,
  equalsPrefix = "",
  incorrectMessage = "Check this line carefully. Follow the bracketed pattern shown in the demonstration.",
}) {
  return React.createElement(
    "div",
    { className: "stepCard" },
    React.createElement(
      "div",
      { className: "stepHeader" },
      React.createElement(
        "div",
        null,
        React.createElement("h3", null, title),
        React.createElement("p", { className: "muted" }, supported ? prompt : title)
      ),
      checked &&
        React.createElement(
          "span",
          { className: correct ? "correct" : "incorrect" },
          correct ? "✓" : "✗"
        )
    ),
    supported && React.createElement("p", { className: "tiny" }, hint),
    equalsPrefix
      ? React.createElement(
          "div",
          { className: "equationInputRow" },
          React.createElement("span", { className: "equalsPrefix" }, equalsPrefix),
          React.createElement("input", {
            className: "studentInput",
            value,
            placeholder,
            onChange: (e) => onChange(e.target.value),
          })
        )
      : React.createElement("input", {
          className: "studentInput",
          value,
          placeholder,
          onChange: (e) => onChange(e.target.value),
        }),
    checked &&
      React.createElement(
        "p",
        { className: correct ? "feedback correct" : "feedback incorrect" },
        correct ? "Correct." : incorrectMessage
      )
  );
}

/**
 * @param {{ steps: Array<{ id?: string, when?: () => boolean, render: () => unknown }> }} props
 */
export function ScaffoldedStepList({ steps }) {
  return React.createElement(
    React.Fragment,
    null,
    steps.map((step, index) => {
      if (!step) return null;
      if (step.when && !step.when()) return null;
      return React.createElement(
        React.Fragment,
        { key: step.id ?? String(index) },
        step.render()
      );
    })
  );
}
