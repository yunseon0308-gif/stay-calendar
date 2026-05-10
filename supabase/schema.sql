-- 스테이달력 이벤트 테이블
CREATE TABLE IF NOT EXISTS events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('concert','festival','fireworks','sports','exhibition','other')),
  date_start DATE NOT NULL,
  date_end DATE NOT NULL,
  venue TEXT NOT NULL,
  location TEXT NOT NULL,
  expected_visitors INTEGER,
  source_url TEXT,
  description TEXT,
  external_id TEXT UNIQUE,     -- 크롤링 중복 방지용
  source TEXT DEFAULT 'manual', -- 'kopis' | 'interpark' | 'manual'
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_events_date ON events(date_start, date_end);
CREATE INDEX IF NOT EXISTS idx_events_location ON events(location);
CREATE INDEX IF NOT EXISTS idx_events_category ON events(category);

-- updated_at 자동 갱신 트리거
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN NEW.updated_at = NOW(); RETURN NEW; END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_events_updated_at
  BEFORE UPDATE ON events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- RLS (Row Level Security) - 읽기는 누구나, 쓰기는 인증 필요
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read" ON events FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Auth write" ON events FOR ALL USING (auth.role() = 'authenticated');
