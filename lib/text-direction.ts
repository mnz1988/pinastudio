// Detects whether a string is (predominantly) Persian/Arabic script and
// returns the matching direction. Used everywhere admin-entered text is
// rendered so Persian shows RTL and English shows LTR automatically.

const RTL_REGEX = /[\u0590-\u05FF\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/;

export function getDir(text: string | null | undefined): "rtl" | "ltr" {
  if (!text) return "rtl";
  return RTL_REGEX.test(text) ? "rtl" : "ltr";
}

export function alignClass(text: string | null | undefined): string {
  return getDir(text) === "rtl" ? "text-right" : "text-left";
}
