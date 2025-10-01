import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export async function POST(request) {
  try {
    const body = await request.json();
    const { name, email, utility, country } = body;

    // Validate required fields
    if (!name || !email || !utility || !country) {
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

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Gridspeed Pilot Request <onboarding@resend.dev>',
      to: ['chanda.sayonsom@gmail.com'],
      subject: 'New Gridspeed Pilot Access Request',
      html: `
        <h2>New Pilot Access Request</h2>
        <p>Someone has requested early access to Gridspeed:</p>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Utility:</strong> ${utility}</li>
          <li><strong>Country:</strong> ${country}</li>
        </ul>
        <p>Please follow up with them at ${email} regarding the pilot program.</p>
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
    console.error('Error processing pilot request:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}