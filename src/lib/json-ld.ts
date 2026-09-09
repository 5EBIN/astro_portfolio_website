// JSON.stringify does not escape "<", so a field value containing the
// literal substring "</script>" would close the inline script tag early
// and let the remainder be parsed as page HTML. Escaping "<" to its
// unicode escape is safe inside a JSON string and keeps valid JSON-LD.
export function safeJsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, '\\u003c');
}
