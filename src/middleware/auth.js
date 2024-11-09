const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async(req, res, next) => {

    try {
        const token = req.header("Authorization").replace("Bearer ", "");
        const {_id} = await jwt.verify(token, "Fahad")

        const user = await User.findOne({_id, "tokens.token": token})

        if(!user) {
            throw new error("No user found")
        }

        req.user = user;
        req.token = token;    

        next()
    } catch(e) {
        res.status(401).send("Please authenticate!")
    }

}

module.exports = auth;