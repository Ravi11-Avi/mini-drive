import jwt from  "jsonwebtoken";

const authmiddleware = (req,res,next)=>{


    const authHeader =  req.headers.authorization;
    if(!authHeader) return res.status(401).json({ msg: "No token, authorization denied" });


    const token  =  authHeader.split(" ")[1];

    if(!token){
        return res.status(401).json({msg:"Token format invalid"})
    } 

    try{
        const decoded  = jwt.verify(token,process.env.JWT_SECRET);
        // const decoded  = jwt.verify(token,"MY_DEBUG_SECRET_123");
        req.user =  decoded.id;
        next();
    }catch (err){
        console.log("JWT VERIFY ERROR:", err.message);
        return res.status(401).json({msg: "Token is not valid "});
    };

};
export default  authmiddleware;