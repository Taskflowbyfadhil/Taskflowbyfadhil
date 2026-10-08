import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { order_id, gross_amount, customer_details } = body;

    // Mengambil Server Key dari Environment Variables / Secret Vercel
    const serverKey = process.env.MIDTRANS_SERVER_KEY;

    if (!serverKey) {
      return NextResponse.json(
        { error: 'Midtrans Server Key belum dikonfigurasi di environment variables.' },
        { status: 500 }
      );
    }

    // Membuat Basic Authentication Header (Base64 dari Server Key + ':')
    const encodedKey = btoa(`${serverKey}:`);
    const midtransUrl = 'https://api.sandbox.midtrans.com/v2/charge';

    const payload = {
      payment_type: 'qris',
      transaction_details: {
        order_id: order_id || `ORDER-${Date.now()}`,
        gross_amount: gross_amount || 50000,
      },
      customer_details: customer_details || {
        first_name: 'Pelanggan',
        email: 'pelanggan@example.com',
      },
    };

    const response = await fetch(midtransUrl, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Basic ${encodedKey}`,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error_messages || data.message || 'Gagal memproses pembayaran Midtrans' },
        { status: response.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Terjadi kesalahan pada server' },
      { status: 500 }
    );
  }
}