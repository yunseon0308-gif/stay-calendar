'use client';

import { useState, useEffect } from 'react';
import { Event, EventCategory, CATEGORY_LABEL } from '@/types/event';
import { Plus, Trash2, RefreshCw, ArrowLeft, Save } from 'lucide-react';

const EMPTY_FORM: Omit<Event, 'id' | 'created_at'> = {
  title: '',
  category: 'concert',
  date_start: '',
  date_end: '',
  venue: '',
  location: '서울',
  expected_visitors: undefined,
  source_url: '',
  description: '',
};

const LOCATIONS = ['서울','부산','인천','대구','대전','광주','울산','경기','강원','충북','충남','경북','경남','전북','전남','제주','기타'];

export default function AdminPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [crawling, setCrawling] = useState(false);
  const [crawlResult, setCrawlResult] = useState<string>('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => { loadEvents(); }, []);

  async function loadEvents() {
    setLoading(true);
    const res = await fetch('/api/events');
    const data = await res.json();
    setEvents(data.events || []);
    setLoading(false);
  }

  async function handleSave() {
    if (!form.title || !form.date_start || !form.date_end || !form.venue) {
      setMessage('❌ 제목, 날짜, 장소를 모두 입력해주세요.');
      return;
    }
    setSaving(true);
    const res = await fetch('/api/events', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setMessage('✅ 이벤트가 저장되었습니다.');
      setShowForm(false);
      setForm(EMPTY_FORM);
      loadEvents();
    } else {
      setMessage('❌ 저장 실패. Supabase 연결을 확인해주세요.');
    }
    setSaving(false);
    setTimeout(() => setMessage(''), 3000);
  }

  async function handleDelete(id: string, title: string) {
    if (!confirm(`"${title}" 를 삭제하시겠습니까?`)) return;
    await fetch(`/api/events/${id}`, { method: 'DELETE' });
    loadEvents();
  }

  async function handleCrawl() {
    setCrawling(true);
    setCrawlResult('');
    const secret = prompt('크롤 시크릿 키를 입력하세요 (없으면 빈칸):') || '';
    const res = await fetch('/api/crawl', {
      method: 'POST',
      headers: { Authorization: `Bearer ${secret}` },
    });
    const data = await res.json();
    if (data.success) {
      setCrawlResult(`✅ 크롤 완료! 총 ${data.total}개 수집 (KOPIS: ${data.sources?.kopis || 0}, 인터파크: ${data.sources?.interpark || 0}, 문화포털: ${data.sources?.culture || 0})`);
      loadEvents();
    } else {
      setCrawlResult(`❌ 크롤 실패: ${data.error}`);
    }
    setCrawling(false);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b shadow-sm sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="text-gray-400 hover:text-gray-700">
              <ArrowLeft size={20} />
            </a>
            <h1 className="text-lg font-bold text-gray-800">🏨 스테이달력 관리자</h1>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCrawl}
              disabled={crawling}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
            >
              <RefreshCw size={14} className={crawling ? 'animate-spin' : ''} />
              {crawling ? '크롤 중...' : '자동 수집'}
            </button>
            <button
              onClick={() => { setShowForm(true); setForm(EMPTY_FORM); }}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              <Plus size={14} />
              이벤트 추가
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-6 space-y-4">
        {/* 메시지 */}
        {message && (
          <div className="bg-white border rounded-xl p-3 text-sm font-medium">{message}</div>
        )}
        {crawlResult && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-sm text-green-700">{crawlResult}</div>
        )}

        {/* 이벤트 추가 폼 */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-indigo-200 shadow-md p-5">
            <h2 className="text-base font-bold text-gray-800 mb-4">새 이벤트 추가</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-gray-600 mb-1 block">제목 *</label>
                <input
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
                  value={form.title}
                  onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                  placeholder="예: BTS 월드투어 콘서트"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">카테고리 *</label>
                <select
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
                  value={form.category}
                  onChange={e => setForm(f => ({ ...f, category: e.target.value as EventCategory }))}
                >
                  {Object.entries(CATEGORY_LABEL).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">지역 *</label>
                <select
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
                  value={form.location}
                  onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
                >
                  {LOCATIONS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">시작일 *</label>
                <input
                  type="date"
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
                  value={form.date_start}
                  onChange={e => setForm(f => ({ ...f, date_start: e.target.value, date_end: f.date_end || e.target.value }))}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">종료일 *</label>
                <input
                  type="date"
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
                  value={form.date_end}
                  onChange={e => setForm(f => ({ ...f, date_end: e.target.value }))}
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-gray-600 mb-1 block">공연장소 *</label>
                <input
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
                  value={form.venue}
                  onChange={e => setForm(f => ({ ...f, venue: e.target.value }))}
                  placeholder="예: 잠실올림픽주경기장"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">예상 방문객</label>
                <input
                  type="number"
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
                  value={form.expected_visitors || ''}
                  onChange={e => setForm(f => ({ ...f, expected_visitors: Number(e.target.value) || undefined }))}
                  placeholder="예: 100000"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 mb-1 block">공식 링크</label>
                <input
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400"
                  value={form.source_url || ''}
                  onChange={e => setForm(f => ({ ...f, source_url: e.target.value }))}
                  placeholder="https://..."
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-medium text-gray-600 mb-1 block">설명</label>
                <textarea
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-400 resize-none"
                  rows={2}
                  value={form.description || ''}
                  onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                  placeholder="간단한 설명"
                />
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 disabled:opacity-50"
              >
                <Save size={14} />
                {saving ? '저장 중...' : '저장'}
              </button>
              <button
                onClick={() => setShowForm(false)}
                className="px-5 py-2 border rounded-xl text-sm text-gray-600 hover:bg-gray-50"
              >
                취소
              </button>
            </div>
          </div>
        )}

        {/* 이벤트 목록 */}
        <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b flex items-center justify-between">
            <h2 className="font-bold text-gray-800">이벤트 목록 ({events.length}개)</h2>
            <button onClick={loadEvents} className="text-xs text-gray-400 hover:text-gray-600">
              새로고침
            </button>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-400 text-sm">불러오는 중...</div>
          ) : (
            <div className="divide-y">
              {events.map(event => (
                <div key={event.id} className="px-5 py-3 flex items-center justify-between hover:bg-gray-50">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-800 truncate">{event.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {event.date_start} ~ {event.date_end} · {event.location} · {event.venue}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 ml-3">
                    <span className="text-xs text-gray-400 hidden sm:block">
                      {CATEGORY_LABEL[event.category]}
                    </span>
                    <button
                      onClick={() => handleDelete(event.id, event.title)}
                      className="text-red-400 hover:text-red-600 p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
