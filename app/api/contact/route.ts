import { NextRequest, NextResponse } from 'next/server';
import { getCloudflareContext } from '@opennextjs/cloudflare';
import { drizzle } from 'drizzle-orm/d1';
import { contactMessages } from '@/db/schema';
import { verifyTurnstile } from '@/lib/turnstile';

export async function POST(request: NextRequest) {
  const { name, email, message, turnstileToken } = await request.json<{
    name: string;
    email: string;
    message: string;
    turnstileToken: string;
  }>();

  if (!name || !email || !message || !turnstileToken) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  try {
    const { env } = await getCloudflareContext({ async: true });
    const secretKey = env.TURNSTILE_SECRET_KEY || process.env.TURNSTILE_SECRET_KEY || '';

    // Verify Turnstile token
    const valid = await verifyTurnstile(turnstileToken, secretKey);
    if (!valid) {
      return NextResponse.json({ error: 'Verification failed' }, { status: 400 });
    }

    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    // Save message to D1
    const db = drizzle(env.DB);
    await db.insert(contactMessages).values({ id, name, email, message, createdAt });

    // Enqueue async notification
    const cfEnv = env as CloudflareEnv;
    if (cfEnv.CONTACT_QUEUE) {
      await cfEnv.CONTACT_QUEUE.send({ id, name, email, createdAt });
    }

    return NextResponse.json({ success: true });
  } catch (e) {
    console.error('Error handling contact form submission:', e);
    return NextResponse.json({ error: 'Service unavailable' }, { status: 503 });
  }
}
