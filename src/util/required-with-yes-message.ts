export function RequiredWithYesMessage(optionName: string) {
  return `The command-line option "${optionName}" is required with the "yes" flag, which disables interactive prompts.`;
}
