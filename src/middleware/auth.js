import jwt from "jsonwebtoken";

export function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.token;
    
    // Debug logging
    console.log("Auth check - Cookies received:", {
      hasToken: !!token,
      cookieHeader: req.headers.cookie,
      allCookies: req.cookies,
    });
    
    if (!token) {
      console.log("No token found in cookies");
      return res.status(401).json({ message: "Not authenticated" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.id };
    res.locals.userId = decoded.id;
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}


