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
        res.send(e).status(400)
    })  
})

app.get("/users", (req, res) => {
    User.find({}).then((users) => {
        res.send(users)
    }).catch(e => res.send().status(500))
})

app.get("/users/:id/", (req, res) => {
    const _id = req.params.id;

    User.findById(_id).then((user) => {
    res.send(user)
}).catch(e => {
    console.log(e);
    res.status(404).send("not found")
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
