/** Keep Fang's legacy UI keys separate from ESPHome's HTTP entity names. */
export function normalizeEntity<T extends { id: string; api_id?: string }>(data: T): T {
  const slash = data.id.indexOf("/");
  if (slash < 0) return data;

  const domain = data.id.slice(0, slash);
  const name = data.id.slice(slash + 1);
  return {
    ...data,
    id: `${domain}-${name.toLowerCase().replace(/[^a-z0-9_]/g, "_")}`,
    api_id: name,
  };
}

/** Encode the entity segment only: action/query strings are built by callers. */
export function entityPath(entity: { domain: string; id: string; api_id?: string }): string {
  return `${entity.domain}/${encodeURIComponent(entity.api_id ?? entity.id)}`;
}