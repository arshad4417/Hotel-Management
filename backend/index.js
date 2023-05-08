const express = require("express")
const app = express();
const hostname='localhost';
const mongoose = require("./database/db");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser")

//config
if (process.env.NODE_ENV !== "PRODUCTION") {
    require("dotenv").config({ path: "./database/config.env" });
    }

//Uncaught Exception Error Handling
process.on("uncaughtException",(err)=>{
    console.log(`Error : ${err.message}`);
    console.log(`Shuting Down the Server Due to Unhandled Uncaught Error`);
        process.exit(1);
})

//DataBase Connection
mongoose();


//Services
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({extended:true}))

//Rooutes
const product = require("./routes/productRoutes");
const user = require("./routes/userRoutes");

app.use('/api/v1',product);
app.use('/api/v1',user);

//App Get
app.get('/',(req,res)=>{
    res.send("Hello Home");
})

//App Listen
const server = app.listen(process.env.PORT,hostname,()=>{
    console.log(`Server is running on http://${hostname}:${process.env.PORT}`);
})

//Unhandale Promis Rejections
process.on("unhandledRejection",(err)=>{
    console.log(`Error : ${err.message}`);
    console.log(`Shuting Down the Server Due to Unhandled Promise Rejection`);
    server.close(()=>{
        process.exit(1);
    })
});

