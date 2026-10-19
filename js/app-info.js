// SPDX-FileCopyrightText: 2026 Keresztes Zsolt <https://kereszteszsolt.hu>
// SPDX-License-Identifier: MIT

export async function loadAppInfo() {
  const response = await fetch(new URL('../brand/branding.json', import.meta.url));
  if (!response.ok) throw new Error('App information could not be loaded.');
  return response.json();
}

export function appAsset(name) {
  return /^assets\/[A-Za-z0-9_-]+\.(svg|png|ico)$/.test(name)
    ? new URL('../brand/' + name, import.meta.url).href : '';
}
