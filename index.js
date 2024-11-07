const express = require("express");
const app = express();

require('dotenv').config();
const PORT = process.env.PORT || 4000;

app.use(express.json());

require("./config/database").connect();

//importing the route

const user = require("./routes/user");
app.use("/api/v1",user);

//activating the server

app.listen(PORT,() => {
    console.log(`Server is listening at port number ${PORT}`);
})
