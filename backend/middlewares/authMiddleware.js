const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // Get the token from the Authorization header
    const token = req.header('Authorization')?.split(' ')[1];
    // If no token is provided, return an error response
    if (!token) return res.status(401).json({ error: "Access denied" });

    try {
        // Verify the token and attach the user data to the request object
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        // Call next route handler
        next();
    } catch (error) {
        res.status(400).json({ error: "Invalid token" });
    }
};

module.exports = verifyToken;