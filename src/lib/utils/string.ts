export function insertSpaces(string: string) {
  if (string === "ChroMapper") {
    return "ChroMapper"; // sorry
  }
  string = string.replace(/([a-z])([A-Z])/g, "$1 $2");
  string = string.replace(/([A-Z])([A-Z][a-z])/g, "$1 $2");
  return string;
}