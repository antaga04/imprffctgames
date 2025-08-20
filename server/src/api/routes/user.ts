import { Router } from 'express';
import {
    registerUser,
    loginUser,
    updateUserPassword,
    updateUserAvatar,
    getUser,
    updateUserAccount,
    confirmEmail,
    verifyUser,
    logoutUser,
    resendConfirmationEmail,
    deleteUserAvatar,
} from '@/controllers/user';
import { hasValidAuthJwt } from '@/middlewares/authenticated';
import uploadFile from '@/middlewares/uploadFile';
import { resendConfirmationLimiter, avatarLimiter, registerLimiter } from '@/middlewares/rateLimiters';
import { emailValidationMiddleware } from '@/middlewares/emailValidationAPI';
import { mxRecordLookup } from '@/middlewares/mxRecordLookup';

const router: Router = Router();

router.post('/register', registerLimiter, mxRecordLookup, emailValidationMiddleware, registerUser);
router.post('/login', loginUser);
router.put('/', hasValidAuthJwt, updateUserAccount);

router.post('/confirm-email', mxRecordLookup, emailValidationMiddleware, confirmEmail);
router.post(
    '/resend-email',
    resendConfirmationLimiter,
    mxRecordLookup,
    emailValidationMiddleware,
    resendConfirmationEmail,
);

router.put('/newpassword', hasValidAuthJwt, updateUserPassword);
router.get('/', hasValidAuthJwt, getUser);
router.put('/avatar', hasValidAuthJwt, avatarLimiter, uploadFile('avatar', 'avatars'), updateUserAvatar);
router.delete('/avatar', hasValidAuthJwt, deleteUserAvatar);

router.get('/verify', hasValidAuthJwt, verifyUser);
router.post('/logout', logoutUser);

export default router;
