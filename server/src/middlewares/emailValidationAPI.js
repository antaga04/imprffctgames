import axios from 'axios';

const emailValidationMiddleware = async (req, res, next) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: 'Email address is required.' });
    }

    try {
        const API_URL = `http://apilayer.net/api/check?access_key=${process.env.MAILBOXLAYER_API_KEY}&email=${email}`;

        const response = await axios.get(API_URL);
        const result = response.data;

        if (result.error) {
            // Check if the error is due to reaching the free tier limit
            if (result.error.code === 104) {
                return res.status(429).json({
                    message: 'Maximum registrations reached for this month. Please try again later.',
                });
            }

            return res.status(500).json({ message: 'Email validation service error. Please try again later.' });
        }

        // Check if the email is invalid, disposable, or has no MX records
        if (!result.format_valid || !result.mx_found || result.disposable) {
            return res.status(400).json({
                message: 'Invalid or temporary email address. Please use a valid email.',
            });
        }

        next();
    } catch (error) {
        console.error('Error validating email:', error.message);
        return res.status(500).json({ message: 'Email validation failed. Please try again later.' });
    }
};

export { emailValidationMiddleware };
