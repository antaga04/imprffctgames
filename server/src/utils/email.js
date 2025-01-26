import { Resend } from 'resend';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const sendConfirmationEmail = async (email, token) => {
    const resend = new Resend(process.env.RESEND_API_KEY);
    // Send confirmation email
    const emailTemplatePath = path.join(__dirname, '../../public/email.html');
    const emailTemplate = fs.readFileSync(emailTemplatePath, 'utf-8');

    const confirmationLink = `${process.env.CLIENT_URL}/confirm-email?token=${token}`;
    const customizedEmail = emailTemplate.replace('{{confirmationLink}}', confirmationLink);

    const { data, error } = await resend.emails.send({
        from: 'Imprffct Games <noreply@auth.imprffctgames.com>',
        to: [email],
        subject: 'Email Confirmation',
        html: customizedEmail,
    });

    return { data, error };
};
