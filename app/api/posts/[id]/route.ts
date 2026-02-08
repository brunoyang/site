import { NextResponse } from 'next/server';
import { getPostById, updatePost, deletePost, type Post } from '@/lib/posts';

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const post = await getPostById(id);

  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  return NextResponse.json(post);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json() as Omit<Post, 'id'>;
  const post = await updatePost(id, body);

  if (!post) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  return NextResponse.json(post);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const deleted = await deletePost(id);

  if (!deleted) {
    return NextResponse.json({ error: 'Post not found' }, { status: 404 });
  }

  return new Response(null, { status: 204 });
}
