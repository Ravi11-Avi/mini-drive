import mongoose from "mongoose";

const fileschema = new mongoose.Schema({
    user : {
        type:mongoose.Schema.Types.ObjectId,
        ref: "User",
        required : true,
    },
    name: String,
    key: String,
    url: String,
    size: Number,
    createdAt :{
        type: Date,
        default : Date.now,
    },
});

export default mongoose.model("File", fileschema)