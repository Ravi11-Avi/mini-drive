import mongoose from "mongoose";

const userSchems = new mongoose.Schema({
    name : {type: String ,  required : true},
    email : {type: String ,  required : true , unique :  true},
    password : {type: String  },

    providers: {
        local: { type: Boolean, default: false },
        google: { type: Boolean, default: false },
        github: { type: Boolean, default: false },
    },
    googleID : String  ,
    github :  String  ,
    createdAt:{type: Date, default: Date.now}
    
});

export default mongoose.model("User", userSchems);
