import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from "bcrypt"

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    index: true,
    required: true,
  },
  Fullname: {
    type: String,
    trim: true,
    lowercase: true,
    index: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    required: true,
  },
  avatar: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
    required: true,
  },
  coverImage: {
    type: String,
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    unique: true,
    lowercase: true,
    required: [true, "Password is required"],
  },
  refreshToken: {
    type: String,
    unique: true,
  },
  watchHistory: [{
    type: Schema.Types.ObjectId,
    ref: "video",
  }],
  timestamps:true
});

userSchema.pre("save", async function(next){
  if(!this.isModified("password"))return next();
 this.password=bcrypt.hash(this.password,10)
 next()

})
userSchema.method.isPasswordCorrect=async function (password) {
  
 return await bcrypt.compare(password,this.password)
}
userSchema.methods.generateAccessToken= function(){
 return jwt.sign({
  _id:this._id,
  email:this.email,
  username:this.username,
  Fullname:this.Fullname
 },
 process.env.ACCESS_TOKEN_SECRET,
 {
  expiresIn:process.env.ACCESS_TOKEN_EXPIRY
 }

)
}
userSchema.methods.generateRefreshToken=function(){
  return jwt.sign({
    _id:this._id,
   
   },
   process.env.REFRESH_TOKEN_SECRET,
   {
    expiresIn:process.env.REFRESH_TOKEN_EXPIRY
   }
  
  )
}
const User = mongoose.model("User", userSchema);

export default User;
