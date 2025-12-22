export function isValidText(input) {
  return input && input.trim().length > 0;
}

export function isValidSearch(query) {
  return query && query.length >= 2;
}
