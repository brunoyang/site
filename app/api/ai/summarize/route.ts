import { NextRequest, NextResponse } from 'next/server';
import { getPostById } from '@/lib/posts';
import { generateSummary } from '@/lib/ai';

export async function POST(req: NextRequest) {
  const { postId, locale } = await req.json();
  if (!postId || !locale) {
    return NextResponse.json({ error: 'Missing postId or locale' }, { status: 400 });
  }

  const post = await getPostById(postId);
  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  const content = locale === 'zh' ? post.contentZh : post.content;
  const summary = await generateSummary(postId, content, locale);

  if (!summary) {
    return NextResponse.json({ error: 'AI not available' }, { status: 503 });
  }

  return NextResponse.json({ summary });
}
