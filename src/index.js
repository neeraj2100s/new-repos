import  app  from "./app.js";
import dotenv from "dotenv"
import connectDB from "./db/index.js"
// In src/index.js

dotenv.config() 

connectDB()
.then(()=>{
    app.listen(process.env.PORT)||8000,()=>{
        console.log(` SErver is running at port :${
            process.env.PORT
        }`)
    }
})
.catch((error)=>{
    console.log("Mongo db not connected",error)

})