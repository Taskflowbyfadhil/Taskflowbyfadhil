import { NextResponse } from 'next/server';

// Contoh penanganan GET satu task berdasarkan ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  // TODO: Ambil data dari database berdasarkan `id`
  // const task = await db.task.findUnique({ where: { id } });

  return NextResponse.json({ id, title: 'Contoh Task', description: '', completed: false });
}

// Contoh penanganan PUT / PATCH untuk update
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { title, description, completed } = body;

  // TODO: Update data di database
  // await db.task.update({ where: { id }, data: { title, description, completed } });

  return NextResponse.json({ message: 'Task berhasil diperbarui' });
}