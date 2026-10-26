import { Router, Request, Response } from "express";

const ADMIN_USERNAME = "admin";
const ADMIN_SESSION_COOKIE = "admin_session";

const router = Router();

// Login endpoint
router.post("/login", (req: Request, res: Response) => {
  try {
    const { username, password } = req.body || {};
    
    const trimmedUsername = String(username || "").trim();
    const trimmedPassword = String(password || "").trim();

    if (!trimmedUsername || !trimmedPassword) {
      return res.status(400).json({ 
        success: false, 
        error: "Username and password are required" 
      });
    }

    const configuredPassword = process.env.ADMIN_PASSWORD;
    if (!configuredPassword?.trim()) {
      return res.status(503).json({ success: false, error: "Admin login is not configured" });
    }

    if (trimmedUsername !== ADMIN_USERNAME || trimmedPassword !== configuredPassword) {
      return res.status(401).json({ 
        success: false, 
        error: "Invalid username or password" 
      });
    }

    // Set cookie using res.cookie
    res.cookie(ADMIN_SESSION_COOKIE, "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours in ms
      path: "/",
    });

    return res.json({ success: true, message: "Login successful" });
  } catch (error) {
    console.error("Login error:", error);
    return res.status(500).json({ success: false, error: "Internal server error" });
  }
});

// Logout endpoint
router.post("/logout", (_req: Request, res: Response) => {
  res.clearCookie(ADMIN_SESSION_COOKIE, { path: "/" });
  return res.json({ success: true });
});

// Check auth endpoint
router.get("/check", (req: Request, res: Response) => {
  const cookieHeader = req.headers.cookie || "";
  const isAuthenticated = cookieHeader.includes(`${ADMIN_SESSION_COOKIE}=authenticated`);
  return res.json({
    isAuthenticated,
    username: isAuthenticated ? ADMIN_USERNAME : null,
  });
});

export default router;
