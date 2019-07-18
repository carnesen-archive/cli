export function NotAllowedWithMessage(
  optionName: string,
  otherOptionName: string,
  value: string,
) {
  return `Option "${optionName}" is not allowed when "${otherOptionName}" has value "${value}"`;
}
