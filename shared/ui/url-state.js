/**
 * URL sync helpers for static applets (shareable links on GitHub Pages).
 * Each applet exposes small read/build functions; param names are per-applet "schemas".
 */

export function getSearchParams(
  search = typeof window !== "undefined" ? window.location.search : ""
) {
  const s = search.startsWith("?") ? search.slice(1) : search;
  return new URLSearchParams(s);
}

export function replaceHistoryQuery(queryString) {
  const path = queryString
    ? `${window.location.pathname}?${queryString}`
    : window.location.pathname;
  window.history.replaceState(null, "", path);
}

// --- Completing the square (params: mode, p, c, ex, practice, teacher, tab, demo) ---

export function readCompletingTheSquareState(search, EXAMPLES) {
  const params = getSearchParams(search);
  const mode = params.get("mode") === "unsupported" ? "unsupported" : "supported";
  const practiceMode =
    params.get("practice") === "unscaffolded" ? "unscaffolded" : "scaffolded";
  const teacherMode = params.get("teacher") === "1";
  const showWorking = params.get("demo") !== "0";

  let bottomTab = "practice";
  const tab = params.get("tab");
  if (tab === "howto") bottomTab = "howto";
  else if (tab === "teacher" && teacherMode) bottomTab = "teacher";

  let customP = 6;
  let customC = 11;
  let example = EXAMPLES[0];

  const pNum = Number(params.get("p"));
  const cNum = Number(params.get("c"));
  const exNum = Number(params.get("ex"));

  if (mode === "supported") {
    if (Number.isFinite(exNum) && exNum >= 0 && exNum < EXAMPLES.length) {
      example = EXAMPLES[exNum];
    } else if (Number.isFinite(pNum) && Number.isFinite(cNum)) {
      const idx = EXAMPLES.findIndex((e) => e.p === pNum && e.c === cNum);
      if (idx >= 0) example = EXAMPLES[idx];
    }
  } else {
    if (Number.isFinite(pNum)) customP = pNum;
    if (Number.isFinite(cNum)) customC = cNum;
  }

  return {
    mode,
    practiceMode,
    teacherMode,
    bottomTab,
    showWorking,
    example,
    customP,
    customC,
  };
}

export function buildCompletingTheSquareQuery(state, EXAMPLES) {
  const {
    mode,
    example,
    customP,
    customC,
    practiceMode,
    teacherMode,
    bottomTab,
    showWorking,
  } = state;
  const params = new URLSearchParams();
  if (mode === "unsupported") {
    params.set("mode", "unsupported");
    params.set("p", String(customP));
    params.set("c", String(customC));
  } else {
    const idx = EXAMPLES.findIndex((e) => e.p === example.p && e.c === example.c);
    if (idx >= 0) params.set("ex", String(idx));
    params.set("p", String(example.p));
    params.set("c", String(example.c));
  }
  if (practiceMode === "unscaffolded") params.set("practice", "unscaffolded");
  if (teacherMode) params.set("teacher", "1");
  if (bottomTab === "howto") params.set("tab", "howto");
  else if (bottomTab === "teacher" && teacherMode) params.set("tab", "teacher");
  if (!showWorking) params.set("demo", "0");
  return params.toString();
}

// --- Distance point → plane (params: mode, ex, pdef, abcd, pp, nv, tA–tC, P, rx, ry, practice, teacher, tab, method, demo) ---

function parseCsvTripletPlane(params, key, fallback) {
  const raw = params.get(key);
  if (!raw) return [...fallback];
  const parts = raw.split(",").map((s) => Number(String(s).trim()));
  if (parts.length === 3 && parts.every((n) => Number.isFinite(n))) return parts;
  return [...fallback];
}

function parseCsvQuadPlane(params, key, fallback) {
  const raw = params.get(key);
  if (!raw) return [...fallback];
  const parts = raw.split(",").map((s) => Number(String(s).trim()));
  if (parts.length === 4 && parts.every((n) => Number.isFinite(n))) return parts;
  return [...fallback];
}

function parseNumParam(params, key, fallback) {
  const n = Number(params.get(key));
  return Number.isFinite(n) ? n : fallback;
}

function applyPlaneExample(target, ex) {
  target.planeDef = ex.planeDef;
  target.coeffs = [...ex.coeffs];
  target.planePoint = [...ex.planePoint];
  target.normalVec = [...ex.normalVec];
  target.ptA = [...ex.ptA];
  target.ptB = [...ex.ptB];
  target.ptC = [...ex.ptC];
  target.P = [...ex.P];
  target.rotX = ex.rotX;
  target.rotY = ex.rotY;
}

/**
 * @param {string} search
 * @param {Array<object>} examples Full snapshots: planeDef, coeffs, planePoint, normalVec, ptA, ptB, ptC, P, rotX, rotY
 */
export function readPointToPlaneState(search, examples) {
  const list =
    examples && examples.length
      ? examples
      : [
          {
            planeDef: "general",
            coeffs: [1, 1, 1, -5],
            planePoint: [0, 0, 5],
            normalVec: [1, 1, 1],
            ptA: [0, 0, 4],
            ptB: [4, 0, 4],
            ptC: [0, 3, 4],
            P: [2, 3, 8],
            rotX: 30,
            rotY: 45,
          },
        ];
  const params = getSearchParams(search);
  const teacherMode = params.get("teacher") === "1";
  let bottomTab = "student";
  const tab = params.get("tab");
  if (tab === "howto") bottomTab = "howto";
  else if (tab === "teacher" && teacherMode) bottomTab = "teacher";

  const method = params.get("method") === "projection" ? "projection" : "formula";
  const showWorking = params.get("demo") !== "0";
  const dataMode = params.get("mode") === "unsupported" ? "unsupported" : "supported";
  const practiceMode =
    params.get("practice") === "unscaffolded" ? "unscaffolded" : "scaffolded";

  let exampleIndex = 0;
  const out = {
    teacherMode,
    bottomTab,
    method,
    showWorking,
    dataMode,
    practiceMode,
    exampleIndex,
    planeDef: "general",
    coeffs: [...list[0].coeffs],
    planePoint: [...list[0].planePoint],
    normalVec: [...list[0].normalVec],
    ptA: [...list[0].ptA],
    ptB: [...list[0].ptB],
    ptC: [...list[0].ptC],
    P: [...list[0].P],
    rotX: list[0].rotX,
    rotY: list[0].rotY,
  };

  if (dataMode === "supported") {
    const exNum = Number(params.get("ex"));
    if (Number.isFinite(exNum) && exNum >= 0 && exNum < list.length) {
      exampleIndex = exNum;
      out.exampleIndex = exNum;
      applyPlaneExample(out, list[exNum]);
    } else {
      applyPlaneExample(out, list[0]);
    }
  } else {
    const pd = params.get("pdef");
    out.planeDef =
      pd === "pointNormal" ? "pointNormal" : pd === "threePoints" ? "threePoints" : "general";
    out.coeffs = parseCsvQuadPlane(params, "abcd", [1, 1, 1, -5]);
    out.planePoint = parseCsvTripletPlane(params, "pp", [0, 0, 5]);
    out.normalVec = parseCsvTripletPlane(params, "nv", [1, 1, 1]);
    out.ptA = parseCsvTripletPlane(params, "tA", [0, 0, 4]);
    out.ptB = parseCsvTripletPlane(params, "tB", [4, 0, 4]);
    out.ptC = parseCsvTripletPlane(params, "tC", [0, 3, 4]);
    out.P = parseCsvTripletPlane(params, "P", [2, 3, 8]);
    out.rotX = parseNumParam(params, "rx", 30);
    out.rotY = parseNumParam(params, "ry", 45);
  }

  return out;
}

export function buildPointToPlaneQuery(state, examples) {
  const list = examples && examples.length ? examples : [];
  const {
    teacherMode,
    bottomTab,
    method,
    showWorking,
    dataMode,
    practiceMode,
    planeDef,
    coeffs,
    planePoint,
    normalVec,
    ptA,
    ptB,
    ptC,
    P,
    rotX,
    rotY,
  } = state;
  const params = new URLSearchParams();
  if (dataMode === "unsupported") {
    params.set("mode", "unsupported");
    params.set("pdef", planeDef);
    params.set("abcd", coeffs.map((n) => String(n)).join(","));
    params.set("pp", planePoint.map((n) => String(n)).join(","));
    params.set("nv", normalVec.map((n) => String(n)).join(","));
    params.set("tA", ptA.map((n) => String(n)).join(","));
    params.set("tB", ptB.map((n) => String(n)).join(","));
    params.set("tC", ptC.map((n) => String(n)).join(","));
    params.set("P", P.map((n) => String(n)).join(","));
    params.set("rx", String(rotX));
    params.set("ry", String(rotY));
  } else if (list.length) {
    const idx = list.findIndex(
      (e) =>
        e.planeDef === planeDef &&
        e.coeffs[0] === coeffs[0] &&
        e.coeffs[1] === coeffs[1] &&
        e.coeffs[2] === coeffs[2] &&
        e.coeffs[3] === coeffs[3] &&
        e.planePoint[0] === planePoint[0] &&
        e.planePoint[1] === planePoint[1] &&
        e.planePoint[2] === planePoint[2] &&
        e.normalVec[0] === normalVec[0] &&
        e.normalVec[1] === normalVec[1] &&
        e.normalVec[2] === normalVec[2] &&
        e.ptA[0] === ptA[0] &&
        e.ptA[1] === ptA[1] &&
        e.ptA[2] === ptA[2] &&
        e.ptB[0] === ptB[0] &&
        e.ptB[1] === ptB[1] &&
        e.ptB[2] === ptB[2] &&
        e.ptC[0] === ptC[0] &&
        e.ptC[1] === ptC[1] &&
        e.ptC[2] === ptC[2] &&
        e.P[0] === P[0] &&
        e.P[1] === P[1] &&
        e.P[2] === P[2] &&
        e.rotX === rotX &&
        e.rotY === rotY
    );
    if (idx >= 0) params.set("ex", String(idx));
  }
  if (practiceMode === "unscaffolded") params.set("practice", "unscaffolded");
  if (method === "projection") params.set("method", "projection");
  if (teacherMode) params.set("teacher", "1");
  if (bottomTab === "howto") params.set("tab", "howto");
  else if (bottomTab === "teacher" && teacherMode) params.set("tab", "teacher");
  if (!showWorking) params.set("demo", "0");
  return params.toString();
}

// --- Distance point → line (params: mode, ex, P, A, v, practice, teacher, tab, method, form, demo) ---

function parseCsvTriplet(params, key, fallback) {
  const raw = params.get(key);
  if (!raw) return [...fallback];
  const parts = raw.split(",").map((s) => Number(String(s).trim()));
  if (parts.length === 3 && parts.every((n) => Number.isFinite(n))) return parts;
  return [...fallback];
}

/**
 * @param {string} search
 * @param {Array<{ P: number[], A: number[], v: number[] }>} examples Supported-mode presets (non-empty).
 */
export function readPointToLineState(search, examples) {
  const list =
    examples && examples.length
      ? examples
      : [{ P: [4, 5, 3], A: [1, 2, -1], v: [3, -2, 4] }];
  const params = getSearchParams(search);
  const teacherMode = params.get("teacher") === "1";
  let bottomTab = "student";
  const tab = params.get("tab");
  if (tab === "howto") bottomTab = "howto";
  else if (tab === "teacher" && teacherMode) bottomTab = "teacher";

  const m = params.get("method");
  const method =
    m === "projection" ? "projection" : m === "nearest" ? "nearest" : "cross";
  const form = params.get("form") === "cartesian" ? "cartesian" : "vector";
  const showWorking = params.get("demo") !== "0";
  const mode = params.get("mode") === "unsupported" ? "unsupported" : "supported";
  const practiceMode =
    params.get("practice") === "unscaffolded" ? "unscaffolded" : "scaffolded";

  let exampleIndex = 0;
  let P = list[0].P;
  let A = list[0].A;
  let v = list[0].v;

  if (mode === "supported") {
    const exNum = Number(params.get("ex"));
    if (Number.isFinite(exNum) && exNum >= 0 && exNum < list.length) {
      exampleIndex = exNum;
      ({ P, A, v } = list[exNum]);
    }
  } else {
    P = parseCsvTriplet(params, "P", [4, 5, 3]);
    A = parseCsvTriplet(params, "A", [1, 2, -1]);
    v = parseCsvTriplet(params, "v", [3, -2, 4]);
  }

  return {
    teacherMode,
    bottomTab,
    method,
    form,
    showWorking,
    mode,
    practiceMode,
    P,
    A,
    v,
    exampleIndex,
  };
}

/**
 * @param {object} state
 * @param {Array<{ P: number[], A: number[], v: number[] }>} examples
 */
export function buildPointToLineQuery(state, examples) {
  const list = examples && examples.length ? examples : [];
  const {
    teacherMode,
    bottomTab,
    method,
    form,
    showWorking,
    mode,
    practiceMode,
    P,
    A,
    v,
  } = state;
  const params = new URLSearchParams();
  if (mode === "unsupported") {
    params.set("mode", "unsupported");
    params.set("P", P.map((n) => String(n)).join(","));
    params.set("A", A.map((n) => String(n)).join(","));
    params.set("v", v.map((n) => String(n)).join(","));
  } else if (list.length) {
    const idx = list.findIndex(
      (e) =>
        e.P[0] === P[0] &&
        e.P[1] === P[1] &&
        e.P[2] === P[2] &&
        e.A[0] === A[0] &&
        e.A[1] === A[1] &&
        e.A[2] === A[2] &&
        e.v[0] === v[0] &&
        e.v[1] === v[1] &&
        e.v[2] === v[2]
    );
    if (idx >= 0) params.set("ex", String(idx));
  }
  if (practiceMode === "unscaffolded") params.set("practice", "unscaffolded");
  if (method === "projection") params.set("method", "projection");
  else if (method === "nearest") params.set("method", "nearest");
  if (form === "cartesian") params.set("form", "cartesian");
  if (teacherMode) params.set("teacher", "1");
  if (bottomTab === "howto") params.set("tab", "howto");
  else if (bottomTab === "teacher" && teacherMode) params.set("tab", "teacher");
  if (!showWorking) params.set("demo", "0");
  return params.toString();
}

// --- Sketch parabola: standard form y = ax² + bx + c (params: mode, ex, a, b, c, practice, teacher, tab, demo) ---

/**
 * @param {string} search
 * @param {Array<{ a: number, b: number, c: number }>} examples
 */
export function readParabolaStandardState(search, examples) {
  const list =
    examples && examples.length
      ? examples
      : [
          { a: 1, b: -4, c: 3 },
          { a: -1, b: -2, c: 3 },
        ];
  const params = getSearchParams(search);
  const teacherMode = params.get("teacher") === "1";
  let bottomTab = "student";
  const tab = params.get("tab");
  if (tab === "howto") bottomTab = "howto";
  else if (tab === "teacher" && teacherMode) bottomTab = "teacher";

  const showWorking = params.get("demo") !== "0";
  const practiceMode =
    params.get("practice") === "unscaffolded" ? "unscaffolded" : "scaffolded";
  const dataMode = params.get("mode") === "unsupported" ? "unsupported" : "supported";

  let exampleIndex = 0;
  const out = {
    teacherMode,
    bottomTab,
    showWorking,
    practiceMode,
    dataMode,
    exampleIndex,
    a: list[0].a,
    b: list[0].b,
    c: list[0].c,
  };

  if (dataMode === "supported") {
    const exNum = Number(params.get("ex"));
    if (Number.isFinite(exNum) && exNum >= 0 && exNum < list.length) {
      exampleIndex = exNum;
      out.exampleIndex = exNum;
      const ex = list[exNum];
      out.a = ex.a;
      out.b = ex.b;
      out.c = ex.c;
    } else {
      const ex = list[0];
      out.a = ex.a;
      out.b = ex.b;
      out.c = ex.c;
    }
  } else {
    const pa = Number(params.get("a"));
    const pb = Number(params.get("b"));
    const pc = Number(params.get("c"));
    if (Number.isFinite(pa)) out.a = pa;
    if (Number.isFinite(pb)) out.b = pb;
    if (Number.isFinite(pc)) out.c = pc;
  }

  return out;
}

/**
 * @param {object} state
 * @param {Array<{ a: number, b: number, c: number }>} examples
 */
export function buildParabolaStandardQuery(state, examples) {
  const list = examples && examples.length ? examples : [];
  const {
    teacherMode,
    bottomTab,
    showWorking,
    practiceMode,
    dataMode,
    a,
    b,
    c,
  } = state;
  const params = new URLSearchParams();
  if (dataMode === "unsupported") {
    params.set("mode", "unsupported");
    params.set("a", String(a));
    params.set("b", String(b));
    params.set("c", String(c));
  } else if (list.length) {
    const idx = list.findIndex((e) => e.a === a && e.b === b && e.c === c);
    if (idx >= 0) params.set("ex", String(idx));
  }
  if (practiceMode === "unscaffolded") params.set("practice", "unscaffolded");
  if (teacherMode) params.set("teacher", "1");
  if (bottomTab === "howto") params.set("tab", "howto");
  else if (bottomTab === "teacher" && teacherMode) params.set("tab", "teacher");
  if (!showWorking) params.set("demo", "0");
  return params.toString();
}

// --- Sketch parabola: vertex form y = a(x−h)² + k (params: mode, ex, a, h, k, practice, teacher, tab, demo) ---

/**
 * @param {string} search
 * @param {Array<{ a: number, h: number, k: number }>} examples
 */
export function readParabolaVertexState(search, examples) {
  const list =
    examples && examples.length
      ? examples
      : [
          { a: 2, h: 1, k: -3 },
          { a: -0.5, h: -2, k: 4 },
        ];
  const params = getSearchParams(search);
  const teacherMode = params.get("teacher") === "1";
  let bottomTab = "student";
  const tab = params.get("tab");
  if (tab === "howto") bottomTab = "howto";
  else if (tab === "teacher" && teacherMode) bottomTab = "teacher";

  const showWorking = params.get("demo") !== "0";
  const practiceMode =
    params.get("practice") === "unscaffolded" ? "unscaffolded" : "scaffolded";
  const dataMode = params.get("mode") === "unsupported" ? "unsupported" : "supported";

  let exampleIndex = 0;
  const out = {
    teacherMode,
    bottomTab,
    showWorking,
    practiceMode,
    dataMode,
    exampleIndex,
    a: list[0].a,
    h: list[0].h,
    k: list[0].k,
  };

  if (dataMode === "supported") {
    const exNum = Number(params.get("ex"));
    if (Number.isFinite(exNum) && exNum >= 0 && exNum < list.length) {
      exampleIndex = exNum;
      out.exampleIndex = exNum;
      const ex = list[exNum];
      out.a = ex.a;
      out.h = ex.h;
      out.k = ex.k;
    } else {
      const ex = list[0];
      out.a = ex.a;
      out.h = ex.h;
      out.k = ex.k;
    }
  } else {
    const pa = Number(params.get("a"));
    const ph = Number(params.get("h"));
    const pk = Number(params.get("k"));
    if (Number.isFinite(pa)) out.a = pa;
    if (Number.isFinite(ph)) out.h = ph;
    if (Number.isFinite(pk)) out.k = pk;
  }

  return out;
}

/**
 * @param {object} state
 * @param {Array<{ a: number, h: number, k: number }>} examples
 */
export function buildParabolaVertexQuery(state, examples) {
  const list = examples && examples.length ? examples : [];
  const {
    teacherMode,
    bottomTab,
    showWorking,
    practiceMode,
    dataMode,
    a,
    h,
    k,
  } = state;
  const params = new URLSearchParams();
  if (dataMode === "unsupported") {
    params.set("mode", "unsupported");
    params.set("a", String(a));
    params.set("h", String(h));
    params.set("k", String(k));
  } else if (list.length) {
    const idx = list.findIndex((e) => e.a === a && e.h === h && e.k === k);
    if (idx >= 0) params.set("ex", String(idx));
  }
  if (practiceMode === "unscaffolded") params.set("practice", "unscaffolded");
  if (teacherMode) params.set("teacher", "1");
  if (bottomTab === "howto") params.set("tab", "howto");
  else if (bottomTab === "teacher" && teacherMode) params.set("tab", "teacher");
  if (!showWorking) params.set("demo", "0");
  return params.toString();
}
