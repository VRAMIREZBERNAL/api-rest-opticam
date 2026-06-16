import jwt from "jsonwebtoken";

export const requiereToken = (req, res, next) => {
    try {
        const token = req.headers?.authorization;
        if (!token) throw new Error("No existe el token en el header usa Bearer");
        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({ error: error.message });
    }
}