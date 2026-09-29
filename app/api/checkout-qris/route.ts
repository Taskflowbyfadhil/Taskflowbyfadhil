import { NextResponse } from 'next/server';
import midtransClient from 'midtrans-client';

const coreApi = new midtransClient.CoreApi({
  isProduction: false, // Ubah ke true jika sudah live
  serverKey: process.env.MIDTRANS_SERVER_KEY || '',
  clientKey: process.env.MIDTRANS_CLIENT_KEY || '',
});

export async function POST(req: Request) {
  try {
    const { planName, priceAmount, userEmail, userName } = await req.json();

    const orderId = `TASKFLOW-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const parameter = {
      payment_type: 'qris',
      transaction_details: {
        order_id: orderId,
        gross_amount: priceAmount,
      },
      item_details: [
        {
          id: planName.toLowerCase().replace(/\s+/g, '-'),
          price: priceAmount,
          quantity: 1,
          name: `Langganan ${planName}`,
        },
      ],
      customer_details: {
        first_name: userName || 'User',
        email: userEmail || 'user@example.com',
      },
      qris: {
        acquirer: 'gopay', // Menghasilkan QRIS standar nasional (bisa di-scan semua E-Wallet/m-Banking)
      },
    };

    const chargeResponse = await coreApi.charge(parameter);

    // Ambil URL gambar QR Code bawaan Midtrans
    const qrImageUrl = chargeResponse.actions?.find(
      (action: any) => action.name === 'generate-qr-code'
    )?.url;

    return NextResponse.json({
      success: true,
      orderId: orderId,
      qrImageUrl: qrImageUrl,
      rawQrString: chargeResponse.qr_string,
      grossAmount: chargeResponse.gross_amount,
    });
  } catch (error: any) {
    console.error('Core API QRIS Error:', error);
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal memproses QRIS' },
      { status: 500 }
    );
  }
}