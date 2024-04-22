const express = require("express");
require("./src/db/mongoose.js");

const app = express();
const Port = 3000;

app.listen(Port, () => {
    console.log("Server is runing on port "+ Port);
})
