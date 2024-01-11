import jwt from "jsonwebtoken"

export const generateToken = (userId) => {
    const token = jwt.sign({ userId }, process.env.PRIVATE_KEY, { expiresIn: "48h" })
    return token
}

export const getUserIdFromToken = (token) => {
    const decodedToken = jwt.verify(token, process.env.PRIVATE_KEY)
    return decodedToken.userId
}
