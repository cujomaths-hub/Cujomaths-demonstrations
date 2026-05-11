// KaTeX-first display for CDN React applets (expects window.React and window.katex).

const React = window.React;

/** Keep CDN URLs aligned with the version you load in <head>. */
export const KATEX_CDN_VERSION = "0.16.11";

export function katexStylesheetHref() {
  return `https://cdn.jsdelivr.net/npm/katex@${KATEX_CDN_VERSION}/dist/katex.min.css`;
}

export function katexScriptSrc() {
  return `https://cdn.jsdelivr.net/npm/katex@${KATEX_CDN_VERSION}/dist/katex.min.js`;
}

/**
 * Render a KaTeX math string (inline). Requires katex on window.
 * @param {{ tex: string, className?: string }} props
 */
export function Latex({ tex, className }) {
  const katex = window.katex;
  if (!katex) {
    return React.createElement("span", { className }, tex);
  }
  try {
    const html = katex.renderToString(tex, { throwOnError: false, displayMode: false });
    return React.createElement("span", {
      className,
      dangerouslySetInnerHTML: { __html: html },
    });
  } catch {
    return React.createElement("span", { className }, tex);
  }
}
