const express = require("express");
const User = require("../models/user");

const router = new express.Router();


router.post("/users", async (req, res) => {
    const user = new User(req.body)
    
    try {
        await user.save();
        res.send(user).status(201)
    } catch(e) {
        res.send(e).status(500)
    }   
})

router.get("/users", async (req, res) => {
    try {
        const users = await User.find({})
        res.send(users).status(200)

    } catch(e) {
        res.send().status(500)
    }

   
})

router.get("/users/:id/", async (req, res) => {
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

router.patch("/users/:id", async (req, res) => {
    const id = req.params.id;

    const updates = Object.keys(req.body);
    const updatesFileds = ["name", "email", "password", "age"];
    const isValidOperations = updates.every(update => updatesFileds.includes(update));

    if(!isValidOperations) {
        return res.send({error: "Invalid operations!"}).status(400)
    }

    try {
        const user = await User.findByIdAndUpdate(id, req.body, {runValidators: true, new: true})

        if(!user) {
            return res.send().status(404)
        }

        res.send(user).status(200);

    } catch(e) {
        res.send().status(400)
    }
})

router.delete("/users/:id", async(req, res) => {
    const id = req.params.id;

    try {
        const user = await User.findByIdAndDelete(id)

        if(!user) {
            return res.send().status(400);
        }

        res.send(user).status(200);
    } catch(e) {
        res.send().status(500)
    }
})

module.exports = router;