const allowedIPs = ['123.123.123.123', '456.456.456.456']; 

const ipWhitelistMiddleware = (req, res, next) => {
    const clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    
    // If running behind a proxy, adjust to get the actual IP
    if (allowedIPs.includes(clientIP)) {
        next(); // IP is allowed, proceed to the endpoint
    } else {
        res.status(403).send('Access forbidden: your IP is not allowed');
    }
};