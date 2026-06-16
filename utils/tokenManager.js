import jwt from "jsonwebtoken";

export const generateToken = (id) => {
    const expiresIn = 60 * 15; // Puedes ajustar el tiempo de expiración según tus necesidades

    try {
        const token = jwt.sign({id}, process.env.JWT_SECRET, {expiresIn});
        return {token, expiresIn};
    } catch (error) {
        console.log(error);
    }
};

export const generateRefreshToken = (id, res) => {
    const expiresIn = 60 * 60 * 24 * 30;
    try {
        const refreshToken = jwt.sign({id}, process.env.JWT_REFRESH, {expiresIn})
        
        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: !(process.env.MODO === "developer"),
            expires: new Date(Date.now() + expiresIn * 1000)
        });
    } catch (error) {
        console.log(error)
    }
}