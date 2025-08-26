export function escapeStr(str: string): string {
  if (str.startsWith("'") && str.endsWith("'")) {
    return str.slice(1, -1).replace(/''/g, "'");
  }
  return str;
}
