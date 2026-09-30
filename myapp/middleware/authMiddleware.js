const jwt = require("jsonwebtoken");


const authMiddleware = (req, res, next) => {
     const authHeader = req.headers.authorization;
     const token = authHeader && authHeader.split(" ")[1];
      if (!token) {
        return res.status(401).json({
            message: "Token required"
        });
    }
    try {
        const decoded = jwt.verify(token, "mySecretKey");

        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({
            message: "Invalid token"
        });
    }
};


module.exports = authMiddleware;