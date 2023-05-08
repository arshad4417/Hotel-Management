const mongoose = require("mongoose");

const dataBaseConnect=()=>{mongoose.connect(process.env.DB_URL).then((data)=>{
    console.log("Database Connected Successfully")
})}

module.exports = dataBaseConnect;