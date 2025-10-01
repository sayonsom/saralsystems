import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, company } = body;

    // Validate required fields
    if (!email || !company) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Check if API key exists
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return NextResponse.json(
        { error: 'Email service not configured' },
        { status: 500 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);

    // Send notification email to admin
    const { data, error } = await resend.emails.send({
      from: 'Gridspeed Information Request <onboarding@resend.dev>',
      to: ['chanda.sayonsom@gmail.com'],
      subject: 'New Gridspeed Information Download Request',
      html: `
        <h2>New Information Download Request</h2>
        <p>Someone has requested the Gridspeed pitch deck and demo video:</p>
        <ul>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Company:</strong> ${company}</li>
        </ul>
        <p>Please send them the pitch deck and demo video to the email address provided.</p>
      `,
    });

    if (error) {
      console.error('Resend API error:', error);
      return NextResponse.json(
        { error: 'Failed to send email', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: 'Request submitted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error processing download request:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}