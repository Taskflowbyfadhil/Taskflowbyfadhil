import { NextResponse } from 'next/server';
import midtransClient from 'midtrans-client';

const coreApi = new midtransClient.CoreApi({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY || '',
  clientKey: process.env.MIDTRANS_CLIENT_KEY || '',
});

export async function POST(req: Request) {
  try {
    const statusNotification = await req.json();

    // Verifikasi notifikasi dari Midtrans
    const notification = await coreApi.transaction.notification(statusNotification);
    
    const orderId = notification.order_id;
    const transactionStatus = notification.transaction_status;
    const fraudStatus = notification.fraud_status;

    console.log(`Notification received for Order ID ${orderId}: ${transactionStatus}`);

    if (transactionStatus === 'capture' || transactionStatus === 'settlement') {
      if (fraudStatus === 'accept' || !fraudStatus) {
        // TODO: Update status user/pembayaran di database kamu menjadi PAID/ACTIVE
        console.log(`Pembayaran untuk ${orderId} SUKSES!`);
      }
    } else if (
      transactionStatus === 'cancel' ||
      transactionStatus === 'deny' ||
      transactionStatus === 'expire'
    ) {
      // TODO: Update status pembayaran di database kamu menjadi FAILED/EXPIRED
      console.log(`Pembayaran untuk ${orderId} GAGAL/EXPIRED!`);
    }

    return NextResponse.json({ status: 'OK' });
  } catch (error: any) {
    console.error('Error Webhook Midtrans:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}