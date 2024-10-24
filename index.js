const express = require("express");
require("./src/db/mongoose.js");

const User = require("./src/models/user.js")
const Task = require("./src/models/task.js");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json())

app.post("/user", async (req, res) => {
    const user = new User(req.body)
    
    try {
        await user.save();
        res.send(user).status(201)
    } catch(e) {
        res.send(e).status(500)
    }   
})

app.get("/users", async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users).status(200)

    } catch(e) {
        res.send().status(500)
    }

   
})

app.get("/users/:id/", async (req, res) => {
    const _id = req.params.id;

    try{
        const user = await User.findById(_id)
        if(!user) {
            return res.status(404).send();
        }

        res.send(user)

    } catch(e) {
        res.status(500).send()
    }
})

app.post("/task", async (req, res) => {
    const task = new Task(req.body);

    task.save().then(() => {
        res.status(201).send(task)
    }).catch((e) => {
        res.status(400).send(e)
    })
})

app.get("/tasks", (req, res) => {
    Task.find({}).then((tasks) => {
        res.send(tasks)
    }).catch((e) => res.send().status(500))
})

app.get("/tasks/:id/", (req, res) => {
    const _id = req.params.id;
    

    Task.findById(_id).then((task) => {
        
        if(!task) {    
            return res.status(404).send()
        }

        res.send(task)

    }).catch(e => res.status(500).send())
})

app.listen(port, () => {
    console.log("Server is runing on port "+ port);
})
