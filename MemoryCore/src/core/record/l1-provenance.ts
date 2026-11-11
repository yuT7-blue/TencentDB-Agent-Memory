/**
 * SQLite stores L1 provenance alongside episodic metadata without a schema change.
 * Keep the provenance field out of the caller-visible episodic metadata object.
 */
export function serializeL1Metadata(
  metadata: object,
  sourceMessageIds: readonly string[],
): string {
  return JSON.stringify({ ...metadata, source_message_ids: sourceMessageIds });
}

export function parseL1Metadata(raw: string | null | undefined): {
  metadata: Record<string, unknown>;
  sourceMessageIds: string[];
} {
  let parsed: unknown;
  try {
    parsed = JSON.parse(raw || "{}");
  } catch {
    return { metadata: {}, sourceMessageIds: [] };
  }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
    return { metadata: {}, sourceMessageIds: [] };
  }
  const { source_message_ids, ...metadata } = parsed as Record<string, unknown>;
  return {
    metadata,
    sourceMessageIds: Array.isArray(source_message_ids)
      ? source_message_ids.filter((id): id is string => typeof id === "string")
      : [],
  };
}
