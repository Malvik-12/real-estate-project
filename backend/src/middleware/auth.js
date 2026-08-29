import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_PASSWORD_HASH = process.env.ADMIN_PASSWORD_HASH;

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
    const isMatch = await bcrypt.compare(password, ADMIN_PASSWORD_HASH);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid password." });
    }

    // Create JWT token — expires in 8 hours
    const token = jwt.sign({ role: "admin" }, JWT_SECRET, { expiresIn: "8h" });

    res.json({ message: "Login successful", token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error during authentication." });
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
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token." });
  }
};
