import dns from 'dns';
import { validateEmail } from '../utils/validation.js';

// MX Record Lookup Middleware
const mxRecordLookup = (req, res, next) => {
    const { email } = req.body;
    if (!validateEmail(email).valid) {
        return res.status(400).json({ message: 'Invalid email address format' });
    }

    const domain = email.split('@')[1];

    dns.resolveMx(domain, (err, addresses) => {
        if (err || addresses.length === 0) {
            return res.status(400).json({ message: 'Invalid email domain' });
        }
        next();
    });
};

export { mxRecordLookup };
