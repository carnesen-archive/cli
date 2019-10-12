export function RandomString() {
  return Math.random()
    .toString(36)
    .substring(2);
}
