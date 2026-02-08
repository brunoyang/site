interface CloudflareEnv {
  DB: D1Database;
  NEXT_INC_CACHE_R2_BUCKET: R2Bucket;
  ASSETS: Fetcher;
  SESSION_SECRET: string;
  KV: KVNamespace;
  AI: Ai;
  TURNSTILE_SECRET_KEY: string;
  CONTACT_QUEUE: Queue;
  ANALYTICS: AnalyticsEngineDataset;
}
