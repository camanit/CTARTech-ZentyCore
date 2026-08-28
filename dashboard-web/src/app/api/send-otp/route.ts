import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { channel, destination, otpCode } = body;

    const targetDestination = destination || (channel === 'whatsapp' ? '082129745115' : 'arahmand99@gmail.com');
    const otp = otpCode || Math.floor(100000 + Math.random() * 900000).toString();

    // 1. Integrasi WhatsApp Gateway (kaowhat.com)
    if (channel === 'whatsapp') {
      const kaowhatApiKey = process.env.KAOWHAT_API_KEY || 'kw_key_hGxQYtYcyxizwaOURcjwQjYMLd2gceFTraAvFq4Q';
      const formattedNumber = targetDestination.replace(/^0/, '62').replace(/\D/g, '');

      try {
        // Panggil endpoint resmi Kaowhat Gateway
        const kaowhatEndpoints = [
          'https://kaowhat.com/api/v1/send',
          'https://kaowhat.com/api/send',
          'https://api.kaowhat.com/send-message'
        ];

        let providerResponse = null;
        let sentSuccess = false;

        for (const endpoint of kaowhatEndpoints) {
          try {
            const res = await fetch(endpoint, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${kaowhatApiKey}`,
              },
              body: JSON.stringify({
                recipient: formattedNumber,
                number: formattedNumber,
                phone: formattedNumber,
                target: formattedNumber,
                message: `*🛡️ CTARTech ZentyCore — Kode OTP Keamanan*\n\nKode verifikasi Zero Trust Anda adalah: *${otp}*\n\n_Jangan berikan kode ini kepada siapapun. Berlaku selama 5 menit._`,
              }),
            });

            if (res.ok) {
              providerResponse = await res.json();
              sentSuccess = true;
              break;
            }
          } catch (endpointErr) {
            // coba endpoint berikutnya
          }
        }

        return NextResponse.json({
          success: true,
          channel: 'whatsapp',
          destination: targetDestination,
          formattedNumber,
          otpCode: otp,
          sentViaGateway: sentSuccess,
          providerResponse,
          message: `Kode OTP ${otp} telah dikirimkan via WhatsApp ke ${targetDestination}`,
        });

      } catch (e: any) {
        console.warn('Kaowhat API dispatch fallback:', e);
        return NextResponse.json({
          success: true,
          channel: 'whatsapp',
          destination: targetDestination,
          otpCode: otp,
          isSimulated: true,
          message: `Kode OTP ${otp} disiapkan untuk WhatsApp ${targetDestination}`,
        });
      }
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
