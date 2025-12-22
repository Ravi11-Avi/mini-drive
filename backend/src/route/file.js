import express from "express";
import multer from "multer";
import multerS3 from "multer-s3";
import { s3Client } from "../config/s3.js";
import authmiddleware from "../middleware/authmiddleware.js";
import File from "../models/file.js";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

const router  = express.Router();

const upload = multer({
    storage : multerS3({
        s3: s3Client,
        bucket:  process.env.AWS_BUCKET_NAME ,
        contentType: multerS3.AUTO_CONTENT_TYPE,

        key: (req,file,cb)=>{
            const key = `${req.user}/${Date.now()}-${file.originalname}`;
            cb(null,key);
        }
    })
})

router.post("/upload", authmiddleware, upload.single("file"), async(req,res)=>{
    try {
        const file =  await File.create({
            user: req.user,
            name: req.file.originalname,
            key: req.file.key,
            url: req.file.location,
            size: req.file.size,

        })

        res.json({mess: "File Upoaded", file})
    }
    catch(err){
        res.status(500).json({mess: err.message})
    }
});



router.get("/list",authmiddleware, async(req,res)=>{
    const files =  await File.find({user: req.user}).sort({createdAt : -1});
    res.json(files);
});


router.delete("/:id", authmiddleware, async(req,res)=>{
    const file =  await File.findById(req.params.id)
    if (!file) return res.status(404).json({mess: "File Not Found "})
    if (file.user.toString()!== req.user) return res.status(403).json({mess: "NOT ALLOWED"})
    

    await s3Client.send(
        new DeleteObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: file.key
        })
    )

    await file.deleteOne();
    res.json({mess: "File Deleted"})

});

export default router;