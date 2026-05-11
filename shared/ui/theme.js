/** Persisted appearance: light | dark | system (follow OS). */
export const THEME_STORAGE_KEY = "cujomaths-theme";

export function getStoredThemeSetting() {
  try {
    const v = localStorage.getItem(THEME_STORAGE_KEY);
    if (v === "light" || v === "dark" || v === "system") return v;
  } catch {
    // ignore
  }
  return "system";
}

export function setStoredThemeSetting(mode) {
  if (mode !== "light" && mode !== "dark" && mode !== "system") return;
  try {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  } catch {
    // ignore
  }
}

export function resolveTheme(setting) {
  if (setting === "dark") return "dark";
  if (setting === "light") return "light";
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

/** Apply resolved theme to <html data-theme="light|dark"> and record the user's setting separately. */
export function applyThemeSetting(setting) {
  setStoredThemeSetting(setting);
  const resolved = resolveTheme(setting);
  document.documentElement.dataset.theme = resolved;
  document.documentElement.dataset.themeSetting = setting;
  return { setting, resolved };
}

/** Call on first paint (inline <head> snippet duplicates this to reduce FOUC). */
export function initThemeFromStorage() {
  return applyThemeSetting(getStoredThemeSetting());
}

export function attachSystemThemeListener(onChange) {
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  const handler = () => {
    if (getStoredThemeSetting() === "system") onChange?.(applyThemeSetting("system"));
  };
  if (mq.addEventListener) mq.addEventListener("change", handler);
  else mq.addListener(handler);
  return () => {
    if (mq.removeEventListener) mq.removeEventListener("change", handler);
    else mq.removeListener(handler);
  };
}
