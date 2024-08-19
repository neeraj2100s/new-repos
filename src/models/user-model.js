import { MongoGCPError } from "mongodb";
import mongoose, {Schema} from "mongoose";
 
const userSchema=new Schema({
    username:{
        type:String,
        unique:String,
        trim:true,
        lowercase:true,
        index:true,
        required:true,



    },
    Fullname:{
        type:String,
       
        trim:true,
        lowercase:true,
        index:true,
        required:true,



    },
    email:{
        type:String,
        unique:String,
        trim:true,
        lowercase:true,
        required:true,
    },
    avatar:{
        type:String,
        unique:String,
        trim:true,
        lowercase:true,
        
        required:true,



    },
    coverImage:{
        type:String,
        unique:String,
        trim:true,
        lowercase:true,



    },
    password:{
        type:String,
        unique:String,
        lowercase:true,
        required:true ,"password is required",



    },
    refreshToken:{
        type:String,
        unique:String,
       



    },
    watchHistory:{
        type:Schema.Types.ObjectId,
        ref:"video"
    }

})

const User= mongoose.model("User",userSchema)


