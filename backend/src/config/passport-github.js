import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import User from "../models/user.js";
import dotenv from "dotenv";

dotenv.config();

passport.use(
  "github", // ✅ STRATEGY NAME (MANDATORY)
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/auth/github/callback",
      scope: ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // Find user by GitHub ID
        let user = await User.findOne({ github: profile.id });

        if (!user) {
          user = await User.create({
            name: profile.displayName || profile.username,
            email: profile.emails?.[0]?.value,
            github: profile.id,
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);
