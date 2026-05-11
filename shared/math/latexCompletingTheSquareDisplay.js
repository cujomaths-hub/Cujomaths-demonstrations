import { simplifySqrtToLatex } from "./surdLatex.js";

/**
 * KaTeX string builders for the "completing the square" monic quadratic applet.
 * Pass your existing `fmt`, `bValue`, `squareTerm`, and `radicandValue` from the applet.
 */
export function createCompletingTheSquareLatexDisplay({ fmt, bValue, squareTerm, radicandValue }) {
  function fmtToLatexNumber(s) {
    s = String(s);
    if (s === "undefined") return "\\text{undefined}";
    if (!s.includes("/")) return s;
    const [n0, d0] = s.split("/");
    const n = parseInt(n0, 10);
    const d = parseInt(d0, 10);
    if (!Number.isFinite(n) || !Number.isFinite(d) || d === 0) return "\\text{undefined}";
    return `\\frac{${n}}{${d}}`;
  }

  function numberLatex(n) {
    return fmtToLatexNumber(fmt(n));
  }

  function signedTermLatex(value, variableLatex = "") {
    const v = Number(value);
    if (!Number.isFinite(v) || Math.abs(v) < 1e-10) return "";
    const sign = v < 0 ? " - " : " + ";
    const abs = Math.abs(v);
    const coeff = variableLatex && Math.abs(abs - 1) < 1e-10 ? "" : numberLatex(abs);
    return `${sign}${coeff}${variableLatex}`;
  }

  function quadraticLatex(p, c) {
    return `x^{2}${signedTermLatex(p, "x")}${signedTermLatex(c)}`;
  }

  function powerLatex(n) {
    const f = fmt(n);
    if (f.includes("/")) return `\\left(${fmtToLatexNumber(f)}\\right)^{2}`;
    return `${fmtToLatexNumber(f)}^{2}`;
  }

  function middleRewriteWithConstantLatex(p, c) {
    const sign = Number(p) >= 0 ? "+" : "-";
    return `x^{2} ${sign} 2(x)\\left(${numberLatex(bValue(p))}\\right)${signedTermLatex(Number(c))}`;
  }

  function addSubtractLineLatex(p, c) {
    const sign = Number(p) >= 0 ? "+" : "-";
    const b = bValue(p);
    return `x^{2} ${sign} 2(x)\\left(${numberLatex(b)}\\right) + ${powerLatex(b)}${signedTermLatex(Number(c))} - ${powerLatex(b)}`;
  }

  function finalLatex(p, c) {
    const sign = Number(p) >= 0 ? "+" : "-";
    const outside = Number(c) - squareTerm(p);
    return `\\left(x ${sign} ${numberLatex(bValue(p))}\\right)^{2}${signedTermLatex(outside)}`;
  }

  function factorisationLatex(p, c) {
    const sign = Number(p) >= 0 ? "+" : "-";
    const b = numberLatex(bValue(p));
    const r = simplifySqrtToLatex(radicandValue(p, c), fmt);
    return `${quadraticLatex(p, c)} = \\left(x ${sign} ${b} - ${r}\\right)\\left(x ${sign} ${b} + ${r}\\right)`;
  }

  return {
    fmtToLatexNumber,
    numberLatex,
    signedTermLatex,
    quadraticLatex,
    powerLatex,
    middleRewriteWithConstantLatex,
    addSubtractLineLatex,
    finalLatex,
    factorisationLatex,
    simplifySqrtToLatex: (value) => simplifySqrtToLatex(value, fmt),
  };
}
