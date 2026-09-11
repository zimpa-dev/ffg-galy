/**
 * Minimal read-only Firestore REST client for server contexts (metadata
 * generation, sitemap) where pulling in the full Admin SDK would be
 * overkill. Only works for collections whose security rules allow public
 * `read`, which is the case for the public site content (see
 * firestore.rules): news, programs, gallery, site_content, site_settings.
 *
 * Failures are swallowed and return `null`/`[]` so metadata generation and
 * the build never break because Firestore is briefly unreachable.
 */

type FirestoreValue = {
  stringValue?: string;
  integerValue?: string;
  doubleValue?: number;
  booleanValue?: boolean;
  nullValue?: null;
  timestampValue?: string;
  arrayValue?: { values?: FirestoreValue[] };
  mapValue?: { fields?: Record<string, FirestoreValue> };
};

function decodeValue(value: FirestoreValue): unknown {
  if (value.stringValue !== undefined) return value.stringValue;
  if (value.integerValue !== undefined) return Number(value.integerValue);
  if (value.doubleValue !== undefined) return value.doubleValue;
  if (value.booleanValue !== undefined) return value.booleanValue;
  if (value.timestampValue !== undefined) return value.timestampValue;
  if (value.nullValue !== undefined) return null;
  if (value.arrayValue) return (value.arrayValue.values ?? []).map(decodeValue);
  if (value.mapValue) return decodeFields(value.mapValue.fields ?? {});
  return undefined;
}

function decodeFields(fields: Record<string, FirestoreValue>): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(fields)) {
    result[key] = decodeValue(value);
  }
  return result;
}

function baseUrl(): string {
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "ffg-ve";
  return `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents`;
}

/** Fetches a single public Firestore document, or `null` if missing/unreachable. */
export async function getPublicDoc(
  collection: string,
  id: string,
  revalidateSeconds = 3600
): Promise<(Record<string, unknown> & { id: string }) | null> {
  try {
    const res = await fetch(`${baseUrl()}/${collection}/${encodeURIComponent(id)}`, {
      next: { revalidate: revalidateSeconds },
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (!json.fields) return null;
    return { id, ...decodeFields(json.fields) };
  } catch {
    return null;
  }
}

/** Lists documents in a public Firestore collection (best-effort, page size 300). */
export async function listPublicDocs(
  collection: string,
  revalidateSeconds = 3600
): Promise<Array<Record<string, unknown> & { id: string }>> {
  try {
    const res = await fetch(`${baseUrl()}/${collection}?pageSize=300`, {
      next: { revalidate: revalidateSeconds },
    });
    if (!res.ok) return [];
    const json = await res.json();
    const documents: Array<{ name: string; fields?: Record<string, FirestoreValue> }> =
      json.documents ?? [];
    return documents.map((doc) => {
      const id = doc.name.split("/").pop() as string;
      return { id, ...decodeFields(doc.fields ?? {}) };
    });
  } catch {
    return [];
  }
}
