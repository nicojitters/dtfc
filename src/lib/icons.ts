import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { ICON_REGISTRY } from '@/data/icon-registry';

const publicIcons = join(process.cwd(), 'public', 'icons');

export function iconPath(icon: string): string {
  // Registry lookup first — this is the canonical asset name.
  const registryEntry = (ICON_REGISTRY as Record<string, { file: string }>)[icon];
  const filename = registryEntry?.file ?? `${icon}.svg`;
  const absolute = join(publicIcons, filename);
  if (existsSync(absolute)) return `/icons/${filename}`;
  return '/icons/placeholder.svg';
}
