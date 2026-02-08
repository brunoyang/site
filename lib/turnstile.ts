const VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export async function verifyTurnstile(token: string, secretKey: string): Promise<boolean> {
  const res = await fetch(VERIFY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret: secretKey, response: token }),
  });
  const data = await res.json<{ success: boolean }>();
  console.log('Turnstile verification response:', data, 'secretKey: ', secretKey, 'token: ', token);
  return data.success;
}
