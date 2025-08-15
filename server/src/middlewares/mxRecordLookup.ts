import dns from 'dns';
import { validateEmail } from '@/utils/validation';
import { Request, Response, NextFunction } from 'express';
import { sendError } from '@/utils/response';

// MX Record Lookup Middleware
const mxRecordLookup = (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    if (!validateEmail(email).valid) {
        return sendError(res, 400, {
            i18n: 'email.invalid',
            message: 'Email is not valid or cannot be empty.',
        });
    }

    const domain = email.split('@')[1];

    dns.resolveMx(domain, (err, addresses) => {
        if (err || addresses.length === 0) {
            return sendError(res, 400, {
                i18n: 'email.no_mx_records',
                message: 'No MX records found for the email domain.',
            });
        }
        next();
    });
};

export { mxRecordLookup };
