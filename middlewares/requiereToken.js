import jwt from "jsonwebtoken";

export const requiereToken = (req, res, next) => {
    try {
        let token = req.headers?.authorization;
        console.log(token);
        if (!token) throw new Error("No existe el token en el header usa Bearer");

        token = token.split(" ")[1];
        
        const {id} = jwt.verify(token, process.env.JWT_SECRET);
        
        req.id = id

        next();
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