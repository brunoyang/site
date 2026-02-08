interface CloudflareEnv {
  DB: D1Database;
  NEXT_INC_CACHE_R2_BUCKET: R2Bucket;
  ASSETS: Fetcher;
  SESSION_SECRET: string;
  KV: KVNamespace;
}
