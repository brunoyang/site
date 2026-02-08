import { eq, desc } from 'drizzle-orm';
import { getDb } from '@/db';
import { posts } from '@/db/schema';

export type Post = typeof posts.$inferSelect;
export type PostSummary = Omit<Post, 'content' | 'contentZh'>;

const summaryColumns = {
  id: posts.id,
  title: posts.title,
  titleZh: posts.titleZh,
  excerpt: posts.excerpt,
  excerptZh: posts.excerptZh,
  author: posts.author,
  date: posts.date,
};

export async function getAllPosts(): Promise<PostSummary[]> {
  const db = await getDb();
  return db.select(summaryColumns).from(posts).orderBy(desc(posts.date));
}

export async function getPostById(id: string): Promise<Post | null> {
  const db = await getDb();
  const [row] = await db
    .select({
      id: posts.id,
      title: posts.title,
      titleZh: posts.titleZh,
      excerpt: posts.excerpt,
      excerptZh: posts.excerptZh,
      content: posts.content,
      contentZh: posts.contentZh,
      author: posts.author,
      date: posts.date,
    })
    .from(posts)
    .where(eq(posts.id, id));
  return row ?? null;
}

export async function createPost(post: Omit<Post, 'id'>): Promise<Post> {
  const db = await getDb();
  const id = crypto.randomUUID();
  const [row] = await db.insert(posts).values({ id, ...post }).returning();
  return row;
}

export async function updatePost(id: string, post: Omit<Post, 'id'>): Promise<Post | null> {
  const db = await getDb();
  const [row] = await db.update(posts).set(post).where(eq(posts.id, id)).returning();
  return row ?? null;
}

export async function deletePost(id: string): Promise<boolean> {
  const db = await getDb();
  const result = await db.delete(posts).where(eq(posts.id, id)).returning({ id: posts.id });
  return result.length > 0;
}
