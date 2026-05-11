import { createClient } from '@supabase/supabase-js';
import { Event } from '@/types/event';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const isValidUrl = (url: string) => {
  try { return url.startsWith('https://') && url.includes('.supabase.co'); } catch { return false; }
};

export const isSupabaseConfigured = isValidUrl(supabaseUrl) && supabaseKey.length > 20;

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// 이벤트 전체 조회
export async function fetchEvents(): Promise<Event[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('events')
    .select('*')
    .eq('is_active', true)
    .order('date_start', { ascending: true });
  if (error) { console.error('fetchEvents error:', error); return []; }
  return (data || []) as Event[];
}

// 이벤트 생성
export async function createEvent(event: Omit<Event, 'id' | 'created_at'>): Promise<Event | null> {
  if (!supabase) return null;
  const { data, error } = await supabase.from('events').insert([event]).select().single();
  if (error) { console.error('createEvent error:', error); return null; }
  return data as Event;
}

// 이벤트 수정
export async function updateEvent(id: string, event: Partial<Event>): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from('events').update(event).eq('id', id);
  if (error) { console.error('updateEvent error:', error); return false; }
  return true;
}

// 이벤트 삭제 (soft delete)
export async function deleteEvent(id: string): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase.from('events').update({ is_active: false }).eq('id', id);
  if (error) { console.error('deleteEvent error:', error); return false; }
  return true;
}

// 크롤링 데이터 upsert (external_id 기준 중복 방지)
export async function upsertEvents(events: Omit<Event, 'id'>[]): Promise<number> {
  if (!supabase || events.length === 0) return 0;
  const { data, error } = await supabase
    .from('events')
    .upsert(events, { onConflict: 'external_id', ignoreDuplicates: false })
    .select();
  if (error) { console.error('upsertEvents error:', error); return 0; }
  return data?.length || 0;
}

// 구독자 저장
export async function saveSubscriber(email: string, location: string, district: string): Promise<boolean> {
  if (!supabase) return false;
  const { error } = await supabase
    .from('subscribers')
    .insert([{ email, location, district }]);
  if (error) { console.error('saveSubscriber error:', error); return false; }
  return true;
}

// 게시글 조회
export interface Post {
  id: string;
  nickname: string;
  location: string;
  content: string;
  likes: number;
  created_at: string;
}

export async function fetchPosts(): Promise<Post[]> {
  if (!supabase) return [];
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(50);
  if (error) { console.error('fetchPosts error:', error); return []; }
  return (data || []) as Post[];
}

// 게시글 생성
export async function createPost(nickname: string, location: string, content: string): Promise<Post | null> {
  if (!supabase) return null;
  const { data, error } = await supabase
    .from('posts')
    .insert([{ nickname, location, content }])
    .select()
    .single();
  if (error) { console.error('createPost error:', error); return null; }
  return data as Post;
}
