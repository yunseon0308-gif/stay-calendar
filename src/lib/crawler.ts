import axios from 'axios';
import * as cheerio from 'cheerio';
import { Event, EventCategory } from '@/types/event';

// ─────────────────────────────────────────────
// 1. KOPIS (공연예술통합전산망) 공식 API
//    발급: https://www.kopis.or.kr/por/cs/openapi/openApiList.do
// ─────────────────────────────────────────────
const KOPIS_KEY = process.env.KOPIS_API_KEY || '';
const KOPIS_BASE = 'http://www.kopis.or.kr/openApi/restful';

function parseXml(xml: string) {
  const $ = cheerio.load(xml, { xmlMode: true });
  return $;
}

function mapKopisGenre(genreCode: string): EventCategory {
  const map: Record<string, EventCategory> = {
    'AAAA': 'concert',  // 팝
    'CCCA': 'concert',  // 대중음악
    'CCCB': 'concert',  // 클래식
    'CCCC': 'concert',  // 오페라
    'CCCD': 'concert',  // 무용
    'CCCE': 'concert',  // 뮤지컬
    'CCCF': 'festival', // 복합
    'GGGA': 'sports',
    'BBBC': 'exhibition',
  };
  return map[genreCode] || 'other';
}

function mapKopisArea(areaCode: string): string {
  const map: Record<string, string> = {
    '11': '서울', '26': '부산', '27': '대구', '28': '인천',
    '29': '광주', '30': '대전', '31': '울산', '36': '세종',
    '41': '경기', '42': '강원', '43': '충북', '44': '충남',
    '45': '전북', '46': '전남', '47': '경북', '48': '경남', '50': '제주',
  };
  return map[areaCode] || '기타';
}

export async function crawlKopis(monthsAhead = 3): Promise<Omit<Event, 'id'>[]> {
  if (!KOPIS_KEY) {
    console.log('KOPIS API key not set, skipping KOPIS crawl');
    return [];
  }

  const results: Omit<Event, 'id'>[] = [];
  const today = new Date();
  const endDate = new Date(today);
  endDate.setMonth(endDate.getMonth() + monthsAhead);

  const fmt = (d: Date) =>
    `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;

  try {
    const url = `${KOPIS_BASE}/pblprfr?service=${KOPIS_KEY}&stdate=${fmt(today)}&eddate=${fmt(endDate)}&rows=100&prfstate=02&newsql=Y`;
    const res = await axios.get(url, { timeout: 10000 });
    const $ = parseXml(res.data);

    $('db').each((_, el) => {
      const $el = $(el);
      const mt20id = $el.find('mt20id').text().trim();
      const prfnm = $el.find('prfnm').text().trim();
      const prfpdfrom = $el.find('prfpdfrom').text().trim().replace(/\./g, '-');
      const prfpdto = $el.find('prfpdto').text().trim().replace(/\./g, '-');
      const fcltynm = $el.find('fcltynm').text().trim();
      const area = $el.find('area').text().trim();
      const genrenm = $el.find('genrenm').text().trim();
      const pcseguidance = $el.find('pcseguidance').text().trim();

      if (!prfnm || !prfpdfrom) return;

      results.push({
        title: prfnm,
        category: mapKopisGenre($el.find('genreCode').text() || ''),
        date_start: prfpdfrom,
        date_end: prfpdto || prfpdfrom,
        venue: fcltynm,
        location: area || '기타',
        description: genrenm,
        source_url: `https://www.kopis.or.kr/por/db/pblprfr/pblprfrView.do?menuId=MNU_00010&mt20Id=${mt20id}`,
        external_id: `kopis_${mt20id}`,
        source: 'kopis',
      } as Omit<Event, 'id'>);
    });
  } catch (err) {
    console.error('KOPIS crawl error:', err);
  }

  return results;
}

// ─────────────────────────────────────────────
// 2. 인터파크 티켓 (인기 공연 스크래핑)
// ─────────────────────────────────────────────
export async function crawlInterpark(): Promise<Omit<Event, 'id'>[]> {
  const results: Omit<Event, 'id'>[] = [];

  try {
    const res = await axios.get('https://tickets.interpark.com/contents/best?genre=concert', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Accept-Language': 'ko-KR,ko;q=0.9',
      },
      timeout: 15000,
    });

    const $ = cheerio.load(res.data);

    // 인터파크 공연 목록 파싱 (클래스명은 변경될 수 있음)
    $('[class*="GoodsItem"], [class*="goods-item"], .ranking-item').each((i, el) => {
      if (i >= 20) return;
      const $el = $(el);
      const title = $el.find('[class*="title"], .goods-title, h3').first().text().trim();
      const period = $el.find('[class*="period"], [class*="date"], .period').first().text().trim();
      const venue = $el.find('[class*="venue"], [class*="place"], .venue').first().text().trim();
      const link = $el.find('a').first().attr('href') || '';

      if (!title || !period) return;

      // 날짜 파싱 (예: 2026.05.10 ~ 2026.06.30)
      const dateMatch = period.match(/(\d{4}[.\-]\d{2}[.\-]\d{2})/g);
      if (!dateMatch) return;
      const startDate = dateMatch[0].replace(/\./g, '-');
      const endDate = (dateMatch[1] || dateMatch[0]).replace(/\./g, '-');

      // 장소로 지역 추정
      const locationMap: Record<string, string> = {
        '서울': '서울', '부산': '부산', '인천': '인천', '대구': '대구',
        '광주': '광주', '대전': '대전', '울산': '울산', '경기': '경기',
        '잠실': '서울', '고척': '서울', '올림픽': '서울', '상암': '서울',
        '부천': '경기', '수원': '경기', '성남': '경기',
      };
      let location = '기타';
      for (const [key, val] of Object.entries(locationMap)) {
        if (venue.includes(key) || title.includes(key)) { location = val; break; }
      }

      const goodsId = link.match(/goodsCode=(\w+)/)?.[1] || `ip_${i}_${startDate}`;

      results.push({
        title,
        category: 'concert',
        date_start: startDate,
        date_end: endDate,
        venue: venue || '인터파크 공연장',
        location,
        source_url: link.startsWith('http') ? link : `https://tickets.interpark.com${link}`,
        external_id: `interpark_${goodsId}`,
        source: 'interpark',
      } as Omit<Event, 'id'>);
    });
  } catch (err) {
    console.error('Interpark crawl error:', err);
  }

  return results;
}

// ─────────────────────────────────────────────
// 3. 불꽃축제 / 지역 축제 (문화포털 API)
//    발급: https://www.culture.go.kr/data/openapi/openapiView.do?id=454
// ─────────────────────────────────────────────
const CULTURE_KEY = process.env.CULTURE_API_KEY || '';

export async function crawlCulturePortal(): Promise<Omit<Event, 'id'>[]> {
  if (!CULTURE_KEY) return [];
  const results: Omit<Event, 'id'>[] = [];

  try {
    const today = new Date();
    const url = `https://www.culture.go.kr/openapi/rest/publicperformancedisplays/period?serviceKey=${CULTURE_KEY}&from=${today.toISOString().slice(0,10)}&to=${new Date(today.getTime() + 180*86400000).toISOString().slice(0,10)}&rows=100&sido=&realmCode=D000&sortStdr=1`;
    const res = await axios.get(url, { timeout: 10000 });
    const $ = parseXml(res.data);

    $('item').each((_, el) => {
      const $el = $(el);
      const title = $el.find('title').text().trim();
      const startDate = $el.find('startDate').text().trim().replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
      const endDate = $el.find('endDate').text().trim().replace(/(\d{4})(\d{2})(\d{2})/, '$1-$2-$3');
      const place = $el.find('place').text().trim();
      const area = $el.find('sido').text().trim();
      const seq = $el.find('seq').text().trim();

      if (!title || !startDate) return;

      const isFestival = title.includes('축제') || title.includes('페스티벌');
      const isFireworks = title.includes('불꽃') || title.includes('빛');

      results.push({
        title,
        category: isFireworks ? 'fireworks' : isFestival ? 'festival' : 'other',
        date_start: startDate,
        date_end: endDate || startDate,
        venue: place,
        location: area || '기타',
        source_url: `https://www.culture.go.kr/openapi/rest/publicperformancedisplays/${seq}?serviceKey=${CULTURE_KEY}`,
        external_id: `culture_${seq}`,
        source: 'culture',
      } as Omit<Event, 'id'>);
    });
  } catch (err) {
    console.error('Culture portal crawl error:', err);
  }

  return results;
}

// ─────────────────────────────────────────────
// 전체 크롤 실행
// ─────────────────────────────────────────────
export async function runAllCrawlers(): Promise<{ total: number; sources: Record<string, number> }> {
  const [kopis, interpark, culture] = await Promise.all([
    crawlKopis(),
    crawlInterpark(),
    crawlCulturePortal(),
  ]);

  const { upsertEvents } = await import('./supabase');
  const all = [...kopis, ...interpark, ...culture];
  const saved = await upsertEvents(all);

  return {
    total: saved,
    sources: {
      kopis: kopis.length,
      interpark: interpark.length,
      culture: culture.length,
    },
  };
}
