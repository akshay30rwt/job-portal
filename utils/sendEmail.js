const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email';

const sendEmail = async ({ to, subject, html }) => {
    const response = await fetch(BREVO_API_URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'api-key': process.env.BREVO_API_KEY
        },
        body: JSON.stringify({
            sender: {
                name: process.env.EMAIL_SENDER_NAME || 'Job Portal',
                email: process.env.EMAIL_SENDER_ADDRESS
            },
            to: [{ email: to }],
            subject,
            htmlContent: html
        })
    });

    if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`Brevo API error (${response.status}): ${errorBody}`);
    }

    return response.json();
};

module.exports = sendEmail;