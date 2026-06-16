import { User } from "../models/User.js";
import jwt from "jsonwebtoken";
import { generateRefreshToken, generateToken } from "../utils/tokenManager.js";

export const register = async(req, res) => {
    const { email, password } = req.body;
    
    try {

        //alternativa buscando por email
        let user = await User.findOne({ email });
        if (user) throw { code: 11000 };

    
        user = new User({ email, password });
        await user.save();

        //Generar jwt token

        return res.status(201).json({ok: true});
    } catch (error) {
        console.log(error);
        //alternativa por defecto mongoose
        if (error.code === 11000) {
            return res.status(400).json({ error: "Ya existe este usuario" });
        }
        return res.status(500).json({error: "Error de servidor"})
    }
};

export const login = async(req, res) => {
    try {
        const { email, password } = req.body;

        let user = await User.findOne({ email });
        if (!user) return res.status(403).json({ error: "Usuario no encontrado" });

        const respuestaPassword = await user.comparePassword(password);
        if (!respuestaPassword) return res.status(403).json({error: "Contraseña incorrecta"})

        // Generar JWT token
        const { token, expiresIn } = generateToken(user.id);
        generateRefreshToken(user.id, res);

        return res.json({ token, expiresIn });
    } catch (error) {
        console.log(error);
        return res.status(500).json({error: "Error de servidor"})
    };
};

export const infoUser = async(req, res) => {
    try {
        const user = await User.findById(req.id).lean();
        return res.json({ email: user.email, id: user.id });
    } catch (error) {
        return res.status(500).json({error: "Error de servidor"});

    }
    
}
export const refreshToken = (req, res) => {
    try {
        const refreshTokenCookie = req.cookies.refreshToken // Lee la cookie guardada
        if(!refreshTokenCookie) throw new Error("No existe el token");

        const {id} = jwt.verify(refreshTokenCookie, process.env.JWT_REFRESH); // se verifica junto a la JWT refresh

        const { token, expiresIn } = generateToken(id); // se genera un nuevo token de seguridad
        return res.json({token, expiresIn}); // se devuelve a la lista como peticion

    } catch (error) {
        console.log(error.message);

        const tokenVerificationErrors = {
            "invalid signature": "La firma del JWT no es válida",
            "jwt expired": "El JWT ha expirado",
            "invalid token": "El JWT no es válido",
            "No Bearer": "El formato del token es incorrecto, debe ser Bearer [token]",
            "jwt malformed": "JWT formato no valido"
        };
        return res.status(401).json({error: tokenVerificationErrors[error.message]});
        
    }
}