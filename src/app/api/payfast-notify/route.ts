import { NextRequest, NextResponse } from 'next/server';

// PayFast IPN (Instant Payment Notification) handler
// PayFast POSTs payment result here after successful payment
export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const params = new URLSearchParams(body);
    const data: Record<string, string> = {};
    params.forEach((v, k) => { data[k] = v; });

    const paymentStatus = data['payment_status'];
    const paymentId = data['m_payment_id'];
    const amount = data['amount_gross'];
    const email = data['email_address'];

    console.log('=== PAYFAST IPN RECEIVED ===');
    console.log('Status:', paymentStatus);
    console.log('Ref:', paymentId);
    console.log('Amount:', amount);
    console.log('Email:', email);
    console.log('===========================');

    // In production: verify PayFast signature, update DB record to 'paid'
    // See: https://developers.payfast.co.za/docs#step_4_confirm_payment

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error('PayFast IPN error:', err);
    return NextResponse.json({ error: 'IPN failed' }, { status: 500 });
  }
}
