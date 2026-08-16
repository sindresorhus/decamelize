// Return true when `input` is lowerCamelCase: no separators, starts lowercase.
const CAMEL_RE = /^[a-z][a-zA-Z0-9]*$/;

export function isCamelCase(input) {
  return typeof input === "string" && CAMEL_RE.test(input) && !/^[A-Z]/.test(input);
}
