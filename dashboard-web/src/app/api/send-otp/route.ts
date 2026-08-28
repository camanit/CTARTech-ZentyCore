import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { channel, destination, otpCode } = body;

    const targetDestination = destination || (channel === 'whatsapp' ? '082129745115' : 'arahmand99@gmail.com');
    const otp = otpCode || Math.floor(100000 + Math.random() * 900000).toString();

    // 1. Integrasi WhatsApp Gateway (kaowhat.com & WebPay WA Engine)
    if (channel === 'whatsapp') {
      const kaowhatApiKey = process.env.KAOWHAT_API_KEY || 'kw_key_hGxQYtYcyxizwaOURcjwQjYMLd2gceFTraAvFq4Q';
      const formattedNumber = targetDestination.replace(/^0/, '62').replace(/\D/g, '');

      let sentSuccess = false;
      let providerError = null;

      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3500);

        const res = await fetch('https://kaowhat.com/api/v1/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${kaowhatApiKey}`,
          },
          body: JSON.stringify({
            recipient: formattedNumber,
            number: formattedNumber,
            phone: formattedNumber,
            message: `*🛡️ CTARTech ZentyCore — Kode OTP Keamanan*\n\nKode verifikasi Zero Trust Anda adalah: *${otp}*\n\n_Jangan berikan kode ini kepada siapapun. Berlaku selama 5 menit._`,
          }),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (res.ok) {
          sentSuccess = true;
        } else {
          providerError = `Gateway returned HTTP ${res.status}`;
        }
      } catch (err: any) {
        providerError = err.name === 'AbortError' ? 'KaoWhat Gateway Server Timeout (Tidak Merespons)' : err.message;
      }

      return NextResponse.json({
        success: true,
        channel: 'whatsapp',
        destination: targetDestination,
        formattedNumber,
        otpCode: otp,
        sentViaGateway: sentSuccess,
        providerStatus: sentSuccess ? 'DELIVERED_TO_GATEWAY' : 'FALLBACK_READY',
        providerError,
        message: sentSuccess
          ? `Kode OTP telah dikirim via WhatsApp ke ${targetDestination}`
          : `KaoWhat gateway sedang offline/timeout. Kode OTP darurat Anda: ${otp}`,
      });
    }

    // 2. Email Channel
    return NextResponse.json({
      success: true,
      channel: 'email',
      destination: targetDestination,
      otpCode: otp,
      message: `Kode OTP verifikasi: ${otp}`,
    });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal memproses OTP' },
      { status: 500 }
    );
  }
}
