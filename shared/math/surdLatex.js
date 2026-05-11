/**
 * Square-free factorisation for integer n >= 0: n = outside^2 * inside (inside square-free).
 */
export function squareFreeFactor(n) {
  n = Math.abs(Number(n));
  if (!Number.isFinite(n) || !Number.isInteger(n)) return { outside: 1, inside: n };
  if (n === 0) return { outside: 0, inside: 1 };
  if (n === 1) return { outside: 1, inside: 1 };
  let outside = 1;
  let inside = n;
  for (let p = 2; p * p <= inside; p++) {
    const sq = p * p;
    while (inside % sq === 0) {
      outside *= p;
      inside = inside / sq;
    }
  }
  return { outside, inside };
}

/**
 * Simplify √(value) to a KaTeX fragment string, using the caller's numeric formatter `fmt`
 * (e.g. monic quadratic fractions like "37/4").
 */
export function simplifySqrtToLatex(value, fmt) {
  const str = fmt(value);
  if (str === "undefined") return "\\text{undefined}";
  if (str === "0") return "0";

  const parts = str.split("/");
  const num = parseInt(parts[0], 10);
  const den = parts.length === 2 ? parseInt(parts[1], 10) : 1;
  if (!Number.isFinite(num) || !Number.isFinite(den) || den === 0) return "\\text{undefined}";

  if (num < 0) return `\\sqrt{${str}}`;

  const denSqrt = Math.sqrt(den);
  if (!Number.isInteger(denSqrt)) {
    return `\\sqrt{\\frac{${num}}{${den}}}`;
  }

  const { outside: outN, inside: inN } = squareFreeFactor(num);
  const outD = denSqrt;

  if (inN === 1) {
    const whole = outN / outD;
    if (Number.isInteger(whole)) return String(whole);
    return `\\frac{${outN}}{${outD}}`;
  }

  const outsideLatex =
    outN === 1 && outD === 1 ? "" : outD === 1 ? String(outN) : `\\frac{${outN}}{${outD}}`;
  const radicalLatex = `\\sqrt{${inN}}`;
  return outsideLatex ? `${outsideLatex}${radicalLatex}` : radicalLatex;
}
