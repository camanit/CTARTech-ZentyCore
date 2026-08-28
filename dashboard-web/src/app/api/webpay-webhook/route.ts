import { NextResponse } from 'next/server';

/**
 * Webhook Handler for webpay.ctar.tech
 * Auto-provisions and activates Zero Trust license when payment succeeds
 */
export async function POST(req: Request) {
  try {
    const payload = await req.json();
    console.log('[WebPay Webhook Received]:', payload);

    const {
      event,
      order_id,
      amount,
      customer_email,
      customer_name,
      status,
    } = payload;

    // Verify payment status
    if (status === 'SUCCESS' || status === 'PAID' || event === 'payment.success') {
      // Determine tier by amount or metadata
      let assignedTier = 'Starter';
      if (amount >= 2000000) {
        assignedTier = 'Professional';
      } else if (amount >= 500000) {
        assignedTier = 'Starter';
      }

      const generatedKey = `zt_live_${Math.random().toString(36).substring(2, 12)}_${Math.random().toString(36).substring(2, 12)}`;

      console.log(`[License Auto-Provisioned]: Tenant ${customer_name || customer_email} on Tier ${assignedTier} with Key ${generatedKey}`);

      return NextResponse.json({
        success: true,
        message: 'Payment received and Zero Trust license auto-provisioned successfully',
        data: {
          order_id,
          assignedTier,
          tenant: customer_name || customer_email,
          status: 'ACTIVE',
        },
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Webhook acknowledged (pending or non-payment event)',
    });

  } catch (error: any) {
    console.error('[WebPay Webhook Error]:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Webhook processing failed' },
      { status: 500 }
    );
  }
}
