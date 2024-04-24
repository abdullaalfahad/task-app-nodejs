const express = require("express");
require("./src/db/mongoose.js");

const User = require("./src/models/user.js")
const Task = require("./src/models/task.js");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json())

app.post("/user", (req, res) => {
    const user = new User(req.body)
    
    user.save().then(() => {
        res.send(user)
    }).catch(e => {
        
        res.send(e)
    })  
})

app.post("/task", (req, res) => {
    const task = new Task(req.body);

    task.save().then(() => {
        res.status(201).send(task)
    }).catch((e) => {
        res.status(400).send(e)
    })
})

app.listen(port, () => {
    console.log("Server is runing on port "+ port);
})
