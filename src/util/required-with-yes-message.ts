export function RequiredWithYesMessage(
  optionName: string,
  anotherOptionName?: string,
  qualifierPrefix?: string,
) {
  return `${qualifierPrefix ? `${qualifierPrefix}, t` : 'T'}he command-line option${
    anotherOptionName ? 's' : ''
  } ${
    anotherOptionName
      ? `"${optionName}" and "${anotherOptionName}" are`
      : `"${optionName}" is`
  } required with the "yes" flag, which disables interactive prompts.`;
}
