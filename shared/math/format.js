export function fmt(n, dp = 3) {
  if (!Number.isFinite(n)) return "undefined";
  if (Math.abs(n) < 1e-10) return "0";
  if (Number.isInteger(n)) return String(n);
  return Number(n.toFixed(dp)).toString();
}

export function vecText(v, dp = 3) {
  return `(${v.map((x) => fmt(x, dp)).join(", ")})`;
}

