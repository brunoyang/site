import { getCloudflareContext } from '@opennextjs/cloudflare';

const summaryKey = (postId: string, locale: string) => `post:summary:${postId}:${locale}`;

async function getAi(): Promise<{ ai: Ai; kv: KVNamespace } | null> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const cfEnv = env as CloudflareEnv;
    if (!cfEnv.AI || !cfEnv.KV) return null;
    return { ai: cfEnv.AI, kv: cfEnv.KV };
  } catch {
    return null;
  }
}

export async function generateSummary(
  postId: string,
  content: string,
  locale: string
): Promise<string | null> {
  const ctx = await getAi();
  if (!ctx) return null;

  const cached = await ctx.kv.get(summaryKey(postId, locale));
  if (cached) return cached;

  const prompt =
    locale === 'zh'
      ? `请用中文将以下文章内容概括为 2-3 句话的摘要：\n\n${content}`
      : `Summarize the following article in 2-3 sentences:\n\n${content}`;

  const result = await ctx.ai.run('@cf/meta/llama-3-8b-instruct', {
    messages: [{ role: 'user' as const, content: prompt }],
  }) as { response?: string };

  const summary = result.response?.trim() ?? null;
  if (summary) {
    await ctx.kv.put(summaryKey(postId, locale), summary, { expirationTtl: 86400 * 7 });
  }
  return summary;
}
