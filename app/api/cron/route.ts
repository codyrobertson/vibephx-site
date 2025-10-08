import { NextResponse, NextRequest } from 'next/server';

/**
 * Serverless cron endpoint. Protected via CRON_SECRET.
 */
export async function GET(req: NextRequest) {
  const auth = req.headers.get('authorization');
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new NextResponse('Unauthorized', { status: 401 });
  }
  // TODO: implement your cron task logic here
  return NextResponse.json({ ok: true });
}
