import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }

    // Generate test SMTP service account from ethereal.email
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: testAccount.user, // generated ethereal user
        pass: testAccount.pass, // generated ethereal password
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: '"JUTAY Newsletter" <newsletter@shuz.pk>', // sender address
      to: email, // receiver
      subject: "Welcome to Shuz Newsletter! 🎉", // Subject line
      text: "Hello! Thank you for subscribing to our newsletter. You'll receive our latest updates and offers soon.", // plain text body
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; color: #333;">
          <h2 style="color: #b11e22;">Welcome to JUTAY!</h2>
          <p>Thank you for subscribing to our newsletter.</p>
          <p>We'll keep you updated with the latest sneaker trends, new arrivals, and exclusive offers.</p>
          <br/>
          <p>Best regards,<br/>The JUTAY Team</p>
        </div>
      `, // html body
    });

    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log("Message sent: %s", info.messageId);
    console.log("Preview URL: %s", previewUrl);

    return NextResponse.json({ 
      success: true, 
      message: 'Subscription successful. Notification sent!',
      previewUrl 
    });

  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json({ error: 'Failed to process subscription' }, { status: 500 });
  }
}
