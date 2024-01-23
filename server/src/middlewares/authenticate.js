import { findUserById } from "../services/user.service.js";
import { getUserIdFromToken } from "./jwtProvider";

export const authenticate = async (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }
        const userId = await getUserIdFromToken(token);
        const user = await findUserById(userId);
        req.user = user;
    } catch (error) {
        return res.status(500).send({ msg: error.message });
    }
    next();
}
