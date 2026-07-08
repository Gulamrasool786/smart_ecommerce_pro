import jwt from "jsonwebtoken";

const generateToken = (userId) =>{
    return jwt.sign(
        {id: userId},
        process.env.jwt_SECRET,
        {
            expiresIn: "7d",
        }
    );
};
export default generateToken;