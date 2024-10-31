const express = require("express");
const Task = require("../models/task");

const router = new express.Router();

router.patch("/tasks/:id", async(req, res) => {

    const id = req.params.id;
    const updates = Object.keys(req.body);
    const updateFileds = ["description", "completed"];
    const isValidOperations = updates.every((update) => updateFileds.includes(update));

    if(!isValidOperations) {
        return res.send({error: "Invalid operation!"}).status(400);
    }

    try {
        const task = await Task.findById(id);

        updates.forEach((update) => task[update] = req.body[update]);
        const updatedTask = await task.save();

        res.send(updatedTask)

    } catch(e) {
        res.send().status(400)
    }
})

router.post("/tasks", async (req, res) => {
    const task = new Task(req.body);

    task.save().then(() => {
        res.status(201).send(task)
    }).catch((e) => {
        res.status(400).send(e)
    })
})

router.get("/tasks", (req, res) => {
    Task.find({}).then((tasks) => {
        res.send(tasks)
    }).catch((e) => res.send().status(500))
})

router.get("/tasks/:id/", (req, res) => {
    const _id = req.params.id;
    

    Task.findById(_id).then((task) => {
        
        if(!task) {    
            return res.status(404).send()
        }

        res.send(task)

    }).catch(e => res.status(500).send())
})

router.delete("/tasks/:id", async(req, res) => {
    const id = req.params.id;

    try {
        const task = await Task.findByIdAndDelete(id)

        if(!task) {
            return res.send().status(400);
        }

        res.send(task).status(200);
    } catch(e) {
        res.send().status(500)
    }
})

module.exports = router;