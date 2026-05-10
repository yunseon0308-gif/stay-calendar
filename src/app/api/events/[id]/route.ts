import { NextResponse } from 'next/server';
import { deleteEvent, updateEvent } from '@/lib/supabase';

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const ok = await deleteEvent(id);
  if (!ok) return NextResponse.json({ error: 'Failed' }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const ok = await updateEvent(id, body);
  if (!ok) return NextResponse.json({ error: 'Failed' }, { status: 500 });
  return NextResponse.json({ success: true });
}
