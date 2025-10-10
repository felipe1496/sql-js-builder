export function escapeStr(str: string): string {
  if (str.startsWith("'") && str.endsWith("'")) {
    return str.slice(1, -1).replace(/''/g, "'");
  }
  return str;
}

export function replace(
  str: string,
  fieldReplacements: Record<string, string>
) {
  let newStr = `${str}`;
  Object.entries(fieldReplacements).forEach(([key, value]) => {
    newStr = newStr.replace(key, value);
  });
  return newStr;
}
