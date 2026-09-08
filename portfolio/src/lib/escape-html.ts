export function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Escapes a frontmatter value, then turns literal "\n" into a real <br> —
// the only HTML this component ever intentionally renders inside a fact
// value. Anything else in the string (<, >, &, quotes) is neutralized
// first, so this stays safe even if a less-trusted source starts writing
// this frontmatter field later (e.g. a future CMS).
export function escapeWithLineBreaks(str: string): string {
  return str.split('\n').map(escapeHtml).join('<br>');
}
