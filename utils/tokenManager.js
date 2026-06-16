import jwt from "jsonwebtoken";

export const generateToken = (id) => {
    const expiresIn = 60 * 15; // Puedes ajustar el tiempo de expiración según tus necesidades

    try {
        const token = jwt.sign({id}, process.env.JWT_SECRET, {expiresIn});
        return {token, expiresIn};
    } catch (error) {
        console.log(error);
    }
}