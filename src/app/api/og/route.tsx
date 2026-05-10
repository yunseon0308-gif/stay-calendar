import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title') || '스테이달력';
  const subtitle = searchParams.get('sub') || '공유숙박업 단가관리 필수 행사 캘린더';

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          display: 'flex',
          flexDirection: 'column',
          background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #6d28d9 100%)',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* 배경 원 장식 */}
        <div style={{
          position: 'absolute', top: -100, right: -100,
          width: 500, height: 500, borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)', display: 'flex',
        }} />
        <div style={{
          position: 'absolute', bottom: -150, left: -80,
          width: 400, height: 400, borderRadius: '50%',
          background: 'rgba(255,255,255,0.05)', display: 'flex',
        }} />

        {/* 상단 로고 */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 16,
          padding: '48px 60px 0',
        }}>
          <div style={{
            fontSize: 40, background: 'white', borderRadius: 16,
            width: 64, height: 64, display: 'flex',
            alignItems: 'center', justifyContent: 'center',
          }}>🏨</div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ color: 'white', fontSize: 32, fontWeight: 900, letterSpacing: -1 }}>
              스테이달력
            </span>
            <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15 }}>
              staycalendar.kr
            </span>
          </div>
        </div>

        {/* 메인 타이틀 */}
        <div style={{
          display: 'flex', flexDirection: 'column',
          padding: '40px 60px',
          flex: 1,
        }}>
          <div style={{
            color: 'white', fontSize: title.length > 20 ? 44 : 56,
            fontWeight: 900, lineHeight: 1.2, marginBottom: 20,
          }}>
            {title}
          </div>
          <div style={{
            color: 'rgba(255,255,255,0.8)', fontSize: 24,
            fontWeight: 400, lineHeight: 1.5,
          }}>
            {subtitle}
          </div>
        </div>

        {/* 하단 행사 태그 배지들 */}
        <div style={{
          display: 'flex', gap: 12, padding: '0 60px 32px',
          flexWrap: 'wrap',
        }}>
          {['🎤 콘서트', '🎆 불꽃놀이', '🎪 축제', '⚽ 스포츠', '🖼️ 전시'].map((tag) => (
            <div key={tag} style={{
              background: 'rgba(255,255,255,0.2)',
              color: 'white', fontSize: 18, fontWeight: 600,
              padding: '8px 20px', borderRadius: 999,
              border: '1px solid rgba(255,255,255,0.3)',
              display: 'flex',
            }}>
              {tag}
            </div>
          ))}
        </div>

        {/* 하단 가로 줄 */}
        <div style={{
          background: 'rgba(255,255,255,0.15)',
          height: 4, width: '100%', display: 'flex',
        }} />

        {/* 하단 설명 */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '20px 60px',
          color: 'rgba(255,255,255,0.8)', fontSize: 18,
        }}>
          <span>💰 행사 전 단가 조정으로 수익 극대화</span>
          <span style={{
            background: 'white', color: '#4f46e5',
            fontWeight: 700, padding: '8px 24px', borderRadius: 999,
            display: 'flex', fontSize: 16,
          }}>
            무료 서비스
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
