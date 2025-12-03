import axios from "axios";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

// ensure env vars are loaded even before server.js runs dotenv.config()
dotenv.config();

const GOOGLE_OAUTH_URL = "https://accounts.google.com/o/oauth2/v2/auth";
const GOOGLE_TOKEN_URL = "https://oauth2.googleapis.com/token";
const GOOGLE_USERINFO_URL = "https://www.googleapis.com/oauth2/v3/userinfo";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

function createToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

export function googleOAuthStart(req, res) {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: "code",
    scope: "openid email profile",
    access_type: "offline",
    prompt: "consent",
  });

  // console.log("Google OAuth URL:", `${GOOGLE_OAUTH_URL}?${params.toString()}`); fixed

  res.redirect(`${GOOGLE_OAUTH_URL}?${params.toString()}`);
}

export async function googleOAuthCallback(req, res) {
  const code = req.query.code;

  if (!code) {
    return res.redirect(`${FRONTEND_URL}/auth/error`);
  }

  try {
    const tokenRes = await axios.post(
      GOOGLE_TOKEN_URL,
      new URLSearchParams({
        code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URI,
        grant_type: "authorization_code",
      }).toString(),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token } = tokenRes.data;

    const profileRes = await axios.get(GOOGLE_USERINFO_URL, {
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    
   // console.log("Google profile:", profileRes.data);

    const { sub, name, email, picture } = profileRes.data;

    let user = await User.findOne({ googleId: sub });
    if (!user) {
      user = await User.create({
        googleId: sub,
        name,
        email,
        picture,
      });
    } else {
      // keep basic info fresh
      user.name = name;
      user.email = email;
      user.picture = picture;
      await user.save();
    }

    const token = createToken(user._id.toString());

    res
      .cookie("token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/",
      })
      .redirect(`${FRONTEND_URL}?auth=success`);
  } catch (error) {
    console.error("Error in googleOAuthCallback:", error.response?.data || error);
    return res.redirect(`${FRONTEND_URL}/auth/error`);
  }
}

export async function getCurrentUser(req, res) {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    const user = await User.findById(req.user.id).select("-__v");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error in getCurrentUser:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export function logout(req, res) {
  res
    .clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    })
    .status(200)
    .json({ message: "Logged out" });
}


