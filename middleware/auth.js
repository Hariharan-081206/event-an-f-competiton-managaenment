// middleware/auth.js

import jwt from 'jsonwebtoken';

// 🔐 Middleware to verify JWT token from the request header
const auth = (req, res, next) => {
  // 📌 Step 1: Read the token from the 'x-auth-token' header
  const token = req.header('x-auth-token');

  // 🛑 Step 2: If no token, deny access
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  try {
    // ✅ Step 3: Verify token using secret key from environment variables
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 🧾 Step 4: Store decoded user payload in request object
    req.user = decoded.user;

    // ✅ Step 5: Call next middleware or route handler
    next();
  } catch (err) {
    // ❌ If token is invalid or expired
    res.status(401).json({ msg: 'Token is not valid' });
  }
};

export default auth;
