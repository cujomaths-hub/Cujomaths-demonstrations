export function dot(u, v) {
  return u.reduce((sum, value, i) => sum + value * v[i], 0);
}

export function cross(u, v) {
  return [
    u[1] * v[2] - u[2] * v[1],
    u[2] * v[0] - u[0] * v[2],
    u[0] * v[1] - u[1] * v[0],
  ];
}

export function add(u, v) {
  return u.map((value, i) => value + v[i]);
}

export function sub(u, v) {
  return u.map((value, i) => value - v[i]);
}

export function mul(k, u) {
  return u.map((value) => k * value);
}

export function mag(u) {
  return Math.sqrt(dot(u, u));
}

export function normalize(u) {
  const m = mag(u);
  return m ? mul(1 / m, u) : [0, 0, 0];
}

