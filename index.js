const express = require("express");
require("./src/db/mongoose.js");

const userRoute = require("./src/routes/user.js");
const taskRoute = require("./src/routes/task.js")

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json())
app.use(userRoute)
app.use(taskRoute)

app.listen(port, () => {
    console.log("Server is runing on port "+ port);
})
