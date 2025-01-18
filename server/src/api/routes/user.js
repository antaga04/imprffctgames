import express from 'express';
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
} from '../controllers/user.js';
import { hasValidAuthJwt } from '../../middlewares/authenticated.js';
import uploadFile from '../../middlewares/uploadFile.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/', hasValidAuthJwt, updateUserAccount);
router.post('/confirm-email', confirmEmail);
router.post('/resend-email', confirmEmail);
router.put('/newpassword', hasValidAuthJwt, updateUserPassword);
router.get('/', hasValidAuthJwt, getUser);
router.put('/avatar', hasValidAuthJwt, uploadFile.single('avatar'), updateUserAvatar);

router.get('/verify', hasValidAuthJwt, verifyUser);
router.post('/logout', logoutUser);

export default router;
