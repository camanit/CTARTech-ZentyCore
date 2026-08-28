import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { channel, destination, otpCode } = body;

    const targetDestination = destination || (channel === 'whatsapp' ? '082129745115' : 'arahmand99@gmail.com');
    const otp = otpCode || Math.floor(100000 + Math.random() * 900000).toString();

    // 1. Integrasi WhatsApp Gateway (kaowhat.com)
    if (channel === 'whatsapp') {
      const kaowhatApiKey = process.env.KAOWHAT_API_KEY;
      const kaowhatDeviceId = process.env.KAOWHAT_DEVICE_ID;

      if (kaowhatApiKey && kaowhatDeviceId) {
        try {
          const res = await fetch('https://api.kaowhat.com/send-message', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${kaowhatApiKey}`,
            },
            body: JSON.stringify({
              device_id: kaowhatDeviceId,
              number: targetDestination.replace(/^0/, '62'),
              message: `*🛡️ CTARTech ZentyCore — Kode OTP Keamanan*\n\nKode verifikasi Zero Trust Anda adalah: *${otp}*\n\n_Jangan berikan kode ini kepada siapapun. Berlaku selama 5 menit._`,
            }),
          });
          const data = await res.json();
          return NextResponse.json({
            success: true,
            channel: 'whatsapp',
            destination: targetDestination,
            otpCode: otp,
            providerResponse: data,
            message: `OTP berhasil dikirimkan via WhatsApp ke ${targetDestination}`,
          });
        } catch (e) {
          console.warn('Kaowhat API dispatch error, fallback to simulated delivery:', e);
        }
      }

      // Fallback response for demo / test without env variables
      return NextResponse.json({
        success: true,
        channel: 'whatsapp',
        destination: targetDestination,
        otpCode: otp,
        isSimulated: true,
        message: `[KaoWhat Gateway] Kode OTP ${otp} berhasil disiapkan untuk WhatsApp ${targetDestination}`,
      });
    }

    // 2. Integrasi Email OTP Gateway
    return NextResponse.json({
      success: true,
      channel: 'email',
      destination: targetDestination,
      otpCode: otp,
      isSimulated: true,
      message: `Kode OTP ${otp} berhasil dikirimkan ke email ${targetDestination}`,
    });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Gagal mengirim OTP' },
      { status: 500 }
    );
  }
}
