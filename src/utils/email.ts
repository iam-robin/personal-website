import { Resend } from 'resend';

interface PostcardData {
    author: string;
    body: string;
    country?: string;
    websiteUrl?: string;
    date: Date;
}

export async function sendPostcardNotification(postcard: PostcardData): Promise<void> {
    try {
        console.log(
            'Available env vars:',
            Object.keys(import.meta.env).filter((key) => key.includes('RESEND'))
        );
        console.log(
            'RESEND_API_KEY value:',
            import.meta.env.RESEND_API_KEY ? 'Found' : 'Not found'
        );

        if (!import.meta.env.RESEND_API_KEY) {
            console.warn('RESEND_API_KEY not found, skipping email notification');
            return;
        }

        const resend = new Resend(import.meta.env.RESEND_API_KEY);

        const { author, body, country, websiteUrl, date } = postcard;

        // Format the email content
        const emailSubject = `New Postcard from ${author}`;

        const emailHtml = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2 style="color: #333; border-bottom: 2px solid #000; padding-bottom: 10px;">
                    📮 New Postcard Received
                </h2>

                <div style="background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #000;">
                    <h3 style="margin-top: 0; color: #333;">Message:</h3>
                    <p style="font-style: italic; line-height: 1.6; margin: 0;">
                        "${body}"
                    </p>
                </div>

                <div style="margin: 20px 0;">
                    <p style="margin: 5px 0;"><strong>From:</strong> ${author}</p>
                    ${country ? `<p style="margin: 5px 0;"><strong>Country:</strong> ${country}</p>` : ''}
                    ${websiteUrl ? `<p style="margin: 5px 0;"><strong>Website:</strong> <a href="${websiteUrl}" target="_blank">${websiteUrl}</a></p>` : ''}
                    <p style="margin: 5px 0;"><strong>Sent:</strong> ${date.toLocaleString()}</p>
                </div>
            </div>
        `;

        const emailText = `
New Postcard from ${author}

Message: "${body}"

From: ${author}
${country ? `Country: ${country}` : ''}
${websiteUrl ? `Website: ${websiteUrl}` : ''}
Sent: ${date.toLocaleString()}

View all postcards at https://iamrob.in/postcards
        `.trim();

        await resend.emails.send({
            from: 'Postcard <onboarding@resend.dev>',
            to: ['hey@iamrob.in'],
            subject: emailSubject,
            html: emailHtml,
            text: emailText
        });

        console.log('Postcard notification email sent successfully');
    } catch (error) {
        // Log error but don't throw - we don't want email failures to break postcard submission
        console.error('Failed to send postcard notification email:', error);
    }
}
