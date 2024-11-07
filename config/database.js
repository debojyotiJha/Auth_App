const mongoose = require("mongoose");


require("dotenv").config();

exports.connect = () =>{
    mongoose.connect(process.env.MONGODB_URL,{
        useNewUrlParser : true,
        useUnifiedTopology : true
    })
    .then( () => {console.log("Db connection successfully established")})
    .catch( (err) => {
        console.log("DB connection issue");
        console.error(err);
        process.exit(1);
    }) 
}

// mongodb+srv://debojyotijha72:8pCBogE1p70TI53o@cluster0.sp7xp.mongodb.net/myNewDatabase