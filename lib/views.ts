import { getCloudflareContext } from '@opennextjs/cloudflare';

const viewKey = (postId: string) => `post:views:${postId}`;

async function getKv(): Promise<KVNamespace | null> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    return (env as CloudflareEnv).KV ?? null;
  } catch {
    return null;
  }
}

function parseCount(value: string | null): number {
  return parseInt(value ?? '0', 10) || 0;
}

export async function incrementViewCount(postId: string): Promise<number> {
  const kv = await getKv();
  if (!kv) return 0;

  const count = parseCount(await kv.get(viewKey(postId))) + 1;
  await kv.put(viewKey(postId), String(count));
  return count;
}

export async function getViewCount(postId: string): Promise<number> {
  const kv = await getKv();
  if (!kv) return 0;

  return parseCount(await kv.get(viewKey(postId)));
}

export async function getViewCounts(postIds: string[]): Promise<Record<string, number>> {
  const kv = await getKv();
  if (!kv) return Object.fromEntries(postIds.map((id) => [id, 0]));

  const entries = await Promise.all(
    postIds.map(async (id) => [id, parseCount(await kv.get(viewKey(id)))] as [string, number])
  );
  return Object.fromEntries(entries);
}
