const express = require("express");
const Task = require("../models/task");
const auth = require("../middleware/auth")

const router = new express.Router();

router.post("/tasks", auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    });

    task.save().then(() => {
        res.status(201).send(task)
    }).catch((e) => {
        res.status(400).send(e)
    })
})

router.get("/tasks", auth, async(req, res) => {
    const match = {}
   
    if(req.query.completed) {
        match.completed = req.query.completed === "true"
    }

    try {
        await req.user.populate({
            path: "tasks",
            match: match
        })

        res.send(req.user.tasks)
    } catch(e) {
        res.send().status(500);
    }
})

router.get("/tasks/:id/", auth, async(req, res) => {
    try{
        const _id = req.params.id;

        const task = await Task.findOne({_id, owner: req.user._id})

        if(!task) {    
            return res.status(404).send()
        }

        res.send(task)

    } catch(e) {
        res.status(500).send()
    }
})

router.patch("/tasks/:id", auth, async(req, res) => {
    const _id = req.params.id;
    const updates = Object.keys(req.body);
    const updateFileds = ["description", "completed"];
    const isValidOperations = updates.every((update) => updateFileds.includes(update));

    if(!isValidOperations) {
        return res.send({error: "Invalid operation!"}).status(400);
    }

    try {
        const task = await Task.findOne({_id, owner: req.user._id});

        if(!task) res.send().status(404)

        updates.forEach((update) => task[update] = req.body[update]);
        const updatedTask = await task.save();

        res.send(updatedTask)

    } catch(e) {
        res.send().status(400)
    }
})

router.delete("/tasks/:id", auth, async(req, res) => {
    const _id = req.params.id;

    try {
        const task = await Task.findOneAndDelete({_id, owner: req.user._id})

        if(!task) {
            return res.send().status(400);
        }

        res.send(task).status(200);
    } catch(e) {
        res.send().status(500)
    }
})

module.exports = router;