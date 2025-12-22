import express from"express";
import passport from "passport";
import jwt from "jsonwebtoken";


const router =express.Router();

router.get("/google",
    passport.authenticate("google", {scope :  ["profile", "email"]})
);

router.get("/google/callback",
    passport.authenticate("google",{session: false}),
    (req,res)=>{
        const token = jwt.sign(
            {id: req.user._id},
            process.env.JWT_SECRET,
            {expiresIn : "7d"}

            
        );
        res.redirect(`http://localhost:5173/drive?token=${token}`)
    }
)
router.get("/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

router.get("/github/callback",
  passport.authenticate("github", { session: false }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.redirect(`http://localhost:5173/drive?token=${token}`);
  }
);

export default router;

