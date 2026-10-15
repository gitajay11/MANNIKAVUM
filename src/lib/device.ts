import { UAParser } from "ua-parser-js";
import type { DeviceHints } from "./responses";

const MAX_LEN = 120;

/**
 * Model-code patterns ua-parser-js does not know, checked after it. CPH is
 * shared by OPPO and OnePlus, so ua-parser's "OPPO" is kept for those.
 */
const VENDOR_BY_PREFIX: [RegExp, string][] = [
  [/^(SM-|GT-)/i, "Samsung"],
  [/^Pixel/i, "Google"],
  [/^RMX/i, "Realme"],
  [/^CPH/i, "OPPO"],
  [/^[VI]\d{4}/i, "Vivo"],
  [/^(NE|LE|KB|IN|HD|GM|PJ|PH)\d{4}/i, "OnePlus"],
  [/^2\d{4}[A-Z0-9]{4,6}$/i, "Xiaomi"],
];

const BROWSER_NAMES: [RegExp, string][] = [
  // Android WebView, and iOS WebKit without a Safari token: WhatsApp, Telegram, etc.
  [/webview|^webkit$/i, "In-app browser"],
  [/samsung/i, "Samsung Internet"],
  [/edge/i, "Edge"],
  [/opera|opr/i, "Opera"],
  [/firefox/i, "Firefox"],
  [/chrome|chromium/i, "Chrome"],
  [/safari/i, "Safari"],
];

function browserName(...candidates: (string | undefined)[]): string | null {
  for (const c of candidates) {
    if (!c) continue;
    for (const [re, name] of BROWSER_NAMES) if (re.test(c)) return name;
    return c;
  }
  return null;
}

/**
 * Brand for a bare Client Hints model code ("23129RAA4G" → Xiaomi). Reduced
 * UAs hide the model, so this asks ua-parser-js's device database with a
 * stand-in Android UA, then falls back to VENDOR_BY_PREFIX.
 */
function vendorFor(model: string): string | undefined {
  const { vendor } = new UAParser(
    `Mozilla/5.0 (Linux; Android 14; ${model}) AppleWebKit/537.36 (KHTML, like Gecko) Mobile Safari/537.36`,
  ).getDevice();
  return vendor ?? VENDOR_BY_PREFIX.find(([re]) => re.test(model))?.[1];
}

function withVendor(model: string, vendor?: string): string {
  const v = vendor ?? vendorFor(model);
  if (!v || model.toLowerCase().startsWith(v.toLowerCase())) return model;
  return `${v} ${model}`;
}

const major = (v?: string) => v?.split(".")[0] || "";

/**
 * "<device> · <OS> <version> · <browser>", e.g.
 *   "Apple iPhone · iOS 18 · Safari", "Samsung SM-S911B · Android 15 · Chrome".
 * Returns null on any failure — device detection must never break a submission.
 */
export function describeDevice(userAgent: string, hints?: DeviceHints): string | null {
  try {
    const { browser, os, device } = new UAParser(userAgent).getResult();
    const osName = os.name === "Mac OS" ? "macOS" : (os.name ?? hints?.platform);

    // Device: Client Hints model → UA model → platform fallback.
    // Reduced Android UAs report the model as "K", which is meaningless.
    const uaModel = device.model && device.model !== "K" ? device.model : undefined;
    let deviceName: string;
    if (hints?.model) deviceName = withVendor(hints.model, device.vendor);
    else if (uaModel && osName !== "macOS") deviceName = withVendor(uaModel, device.vendor);
    else if (osName === "macOS") deviceName = "Apple Mac";
    else if (osName === "Windows") deviceName = "Windows PC";
    else if (osName === "Android") deviceName = device.type === "tablet" ? "Android tablet" : "Android phone";
    else if (osName === "Chrome OS") deviceName = "Chromebook";
    else if (osName === "Linux") deviceName = "Linux PC";
    else deviceName = "Unknown device";

    // OS version: prefer Client Hints; reduced UAs freeze Android at 10 and macOS at 10.15.
    let osLabel = osName ?? "";
    if (osName === "Windows" && hints?.platformVersion) {
      osLabel = Number(major(hints.platformVersion)) >= 13 ? "Windows 11" : "Windows 10";
    } else if (osName) {
      const version = major(hints?.platformVersion) || (osName === "macOS" ? "" : major(os.version));
      osLabel = version ? `${osName} ${version}` : osName;
    }

    const parts = [deviceName, osLabel, browserName(browser.name, hints?.browser)];
    const label = parts.filter(Boolean).join(" · ").slice(0, MAX_LEN);
    return label || null;
  } catch {
    return null;
  }
}
