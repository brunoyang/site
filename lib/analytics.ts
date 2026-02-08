import { getCloudflareContext } from '@opennextjs/cloudflare';

type AnalyticsEventName = 'post_read' | 'ai_summary_generate' | 'contact_submit';

function truncate(value: string, maxLen: number): string {
  if (value.length <= maxLen) return value;
  return value.slice(0, Math.max(0, maxLen - 1)) + '…';
}

async function getDataset(): Promise<AnalyticsEngineDataset | null> {
  try {
    const { env } = await getCloudflareContext({ async: true });
    return (env as CloudflareEnv).ANALYTICS ?? null;
  } catch {
    return null;
  }
}

export async function trackEvent(options: {
  event: AnalyticsEventName;
  locale?: string;
  postId?: string;
  path?: string;
  userAgent?: string | null;
}): Promise<void> {
  const dataset = await getDataset();
  if (!dataset) return;

  try {
    await Promise.resolve(
      dataset.writeDataPoint({
        indexes: [options.event],
        doubles: [1],
        blobs: [
          options.locale ?? '',
          options.postId ?? '',
          options.path ?? '',
          options.userAgent ? truncate(options.userAgent, 512) : '',
        ],
      })
    );
  } catch {
    // Ignore analytics failures to avoid breaking core flows.
  }
}

export async function trackPostRead(options: {
  postId: string;
  locale: string;
  path?: string;
}): Promise<void> {
  return trackEvent({
    event: 'post_read',
    postId: options.postId,
    locale: options.locale,
    path: options.path,
  });
}

export async function trackAiSummaryGenerate(options: {
  postId: string;
  locale: string;
  path?: string;
  userAgent?: string | null;
}): Promise<void> {
  return trackEvent({
    event: 'ai_summary_generate',
    postId: options.postId,
    locale: options.locale,
    path: options.path,
    userAgent: options.userAgent,
  });
}

export async function trackContactSubmit(options: {
  path?: string;
  userAgent?: string | null;
}): Promise<void> {
  return trackEvent({
    event: 'contact_submit',
    path: options.path,
    userAgent: options.userAgent,
  });
}
