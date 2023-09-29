import jwt from "jsonwebtoken";
import "dotenv/config.js"
const SECRET_KEY = 'secretkey123456'

const authenticate = (req, res, next) => {
    const token = req.header.authorzation
    if (!token) {
        return res.status(401).json({
            message: "Authentication failed - missing token"
        })
    }

    console.log("toke", token);

    const tokenwithoutBearer = token.split(" ")[1];


    // verify the token
    jwt.verify(tokenwithoutBearer, SECRET_KEY, (error, decoded) => {
       
       
        if (error) {
            return res.status(401).json({
                message: "Authentication failed - invalid token"
            })
        }
        // attach the decoded token to the request object
        req.decoded = decoded;
        // continue with the request
        next();
    });
}

export default authenticate;