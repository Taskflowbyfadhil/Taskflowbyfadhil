import { NextResponse } from 'next/server';
import midtransClient from 'midtrans-client';

const coreApi = new midtransClient.CoreApi({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY || '',
  clientKey: process.env.MIDTRANS_CLIENT_KEY || '',
});

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const orderId = searchParams.get('orderId');

  if (!orderId) {
    return NextResponse.json({ message: 'Order ID required' }, { status: 400 });
  }

  try {
    const statusResponse = await coreApi.transaction.status(orderId);
    return NextResponse.json({
      status: statusResponse.transaction_status,
    });
  } catch (error: any) {
    return NextResponse.json({ status: 'pending' });
  }
}