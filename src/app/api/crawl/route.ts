import { NextResponse } from 'next/server';
import { runAllCrawlers } from '@/lib/crawler';

// 크롤 실행 API (POST /api/crawl)
// 보안: CRON_SECRET 환경변수로 보호
export async function POST(req: Request) {
  const authHeader = req.headers.get('authorization');
  const secret = process.env.CRON_SECRET;

  if (secret && authHeader !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const result = await runAllCrawlers();
    return NextResponse.json({ success: true, ...result });
  } catch (err) {
    console.error('Crawl failed:', err);
    return NextResponse.json({ error: 'Crawl failed' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ message: 'POST /api/crawl to trigger crawling' });
}
