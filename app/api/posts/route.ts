import { NextResponse } from 'next/server';
import { getAllPosts, createPost, type Post } from '@/lib/posts';

export async function GET() {
  const posts = await getAllPosts();
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const body = await request.json() as Omit<Post, 'id'>;
  const post = await createPost(body);
  return NextResponse.json(post, { status: 201 });
}
