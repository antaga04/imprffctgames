import { CreateEmailResponseSuccess, ErrorResponse, Resend } from 'resend';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PUBLIC_PATH = process.env.IS_PRODUCTION === 'production' ? '../public' : '../../public';

export const sendConfirmationEmail = async (
    email: string,
    token: string,
): Promise<{ data: CreateEmailResponseSuccess | null; error: ErrorResponse | null }> => {
    const resend = new Resend(process.env.RESEND_API_KEY);
    // Load and customize email template
    const emailTemplatePath = path.resolve(__dirname, PUBLIC_PATH, '/email.html');
    const emailTemplate = fs.readFileSync(emailTemplatePath, 'utf-8');

    const confirmationLink = `${process.env.CLIENT_URL}/confirm-email?token=${token}`;
    const customizedEmail = emailTemplate.replace('{{confirmationLink}}', confirmationLink);

    // Send confirmation email
    const { data, error } = await resend.emails.send({
        from: 'Imprffct Games <noreply@auth.imprffctgames.com>',
        to: [email],
        subject: 'Email Confirmation',
        html: customizedEmail,
    });

    return { data, error };
};

export const sendResetPasswordEmail = async (
    email: string,
    token: string,
): Promise<{ data: CreateEmailResponseSuccess | null; error: ErrorResponse | null }> => {
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Load and customize email template
    const emailTemplatePath = path.resolve(__dirname, PUBLIC_PATH, '/resetPassword.html');
    const emailTemplate = fs.readFileSync(emailTemplatePath, 'utf-8');

    const resetPasswordLink = `${process.env.CLIENT_URL}/reset-password?token=${encodeURIComponent(token)}`;
    const customizedEmail = emailTemplate.replace('{{resetPasswordLink}}', resetPasswordLink);

    // Send reset password email
    const { data, error } = await resend.emails.send({
        from: 'Imprffct Games <noreply@auth.imprffctgames.com>',
        to: [email],
        subject: 'Password Reset',
        html: customizedEmail,
    });

    return { data, error };
};

export const sendAccountDeletionEmail = async (
    email: string,
    token: string,
): Promise<{ data: CreateEmailResponseSuccess | null; error: ErrorResponse | null }> => {
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Load and customize email template
    const emailTemplatePath = path.resolve(__dirname, PUBLIC_PATH, '/accountDeletion.html');
    const emailTemplate = fs.readFileSync(emailTemplatePath, 'utf-8');

    const accountDeletionLink = `${process.env.CLIENT_URL}/delete-account?token=${encodeURIComponent(token)}`;
    const customizedEmail = emailTemplate.replace('{{accountDeletionLink}}', accountDeletionLink);

    // Send account deletion email
    const { data, error } = await resend.emails.send({
        from: 'Imprffct Games <noreply@auth.imprffctgames.com>',
        to: [email],
        subject: 'Account Deletion',
        html: customizedEmail,
    });

    return { data, error };
};
