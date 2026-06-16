import { Router} from 'express';
import { infoUser, login, refreshToken, register } from '../controllers/auth.controller.js';
import { body } from 'express-validator';
import { validationResultExpress } from '../middlewares/validationResultExpress.js';
import { requiereToken } from '../middlewares/requiereToken.js';

const router = Router();

router.post(
    '/register',
    [
        body('email', "Formato de email incorrecto")
            .trim()
            .isEmail()
            .normalizeEmail(),
        body('password', "Mínimo 6 caracteres")
            .trim()
            .isLength({min: 6}),
        body('password', "Formato de password incorrecto")
            .custom((value, {req}) => {
                if(value !== req.body.repassword){
                    throw new Error("Las contraseñas no coinciden")
                }
                return value;
            }
        ),
    ],
    validationResultExpress,
    register
);
router.post(
    '/login', 
    [
        body('email', "Formato de email incorrecto")
            .trim()
            .isEmail()
            .normalizeEmail(),
        body('password', "Mínimo 6 caracteres")
            .trim()
            .isLength({min: 6})
    ],
    validationResultExpress,
    login
);
router.get('/protected', requiereToken, infoUser);
router.get('/refresh', refreshToken)

export default router;