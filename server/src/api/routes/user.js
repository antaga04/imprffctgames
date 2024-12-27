import express from 'express';
import { registerUser, loginUser, updateUser, updateUserAvatar, getUser } from '../controllers/user.js';
import { hasValidAuthJwt } from '../../middlewares/authenticated.js';
import uploadFile from '../../middlewares/uploadFile.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/', hasValidAuthJwt, updateUser);
router.get('/', hasValidAuthJwt, getUser);
router.put('/avatar', hasValidAuthJwt, uploadFile.single('avatar'), updateUserAvatar);

export default router;
