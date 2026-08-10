import { existsSync } from 'node:fs';
import { join } from 'node:path';

const publicIcons = join(process.cwd(), 'public', 'icons');

export function iconPath(icon: string): string {
  const filename = `${icon}.svg`;
  const absolute = join(publicIcons, filename);
  return existsSync(absolute) ? `/icons/${filename}` : '/icons/placeholder.svg';
}
