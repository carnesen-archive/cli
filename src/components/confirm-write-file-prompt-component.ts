import { confirmPromptComponent } from './confirm-prompt-component';

export async function confirmWriteFilePromptComponent(props: {
  fileName?: string;
  description?: string;
}) {
  const { fileName, description } = props;
  const prefix = description ? `${description}` : '';
  const quotedFileName = fileName ? `"${fileName}"` : '';
  const items = [prefix, quotedFileName].filter(item => Boolean(item));
  if (items.length === 0) {
    items.push('File');
  }
  return await confirmPromptComponent({
    message: `${items.join(' ')} not found. Do you want to create it now?`,
  });
}
