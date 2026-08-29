import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

// Default fallback hash for 'admin123' and fallback JWT secret
const DEFAULT_ADMIN_HASH = "$2b$12$UIUksvGNYDX9DyvM6ciZmOp3IFnNn03vDa8YJo16ZisXRjGRSCTtK";
const DEFAULT_JWT_SECRET = "bahumukhi_real_estate_jwt_secret_key_2026_secure";

const getAdminPasswordHash = () => (process.env.ADMIN_PASSWORD_HASH?.trim()) || DEFAULT_ADMIN_HASH;
const getJwtSecret = () => (process.env.JWT_SECRET?.trim()) || DEFAULT_JWT_SECRET;

/**
 * POST /api/admin/login
 * Validates password against bcrypt hash and returns a JWT token.
 */
export const adminLogin = async (req, res) => {
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ error: "Password is required." });
  }

  try {
    const adminHash = getAdminPasswordHash();
    const jwtSecret = getJwtSecret();

    const isMatch = await bcrypt.compare(password, adminHash);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password." });
    }

    // Create JWT token — expires in 8 hours
    const token = jwt.sign({ role: "admin" }, jwtSecret, { expiresIn: "8h" });

    return res.json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Server error during authentication: " + err.message });
  }
};

/**
 * Middleware: verifyToken
 * Protects admin-only routes by requiring a valid JWT in the Authorization header.
 */
export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Access denied. No token provided." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const jwtSecret = getJwtSecret();
    const decoded = jwt.verify(token, jwtSecret);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};
