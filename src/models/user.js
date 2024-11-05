const mongoose = require('mongoose');
const validator = require('validator');

const bcrypt = require('bcryptjs');


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if(!validator.isEmail(value)) {
                throw new Error("Email is invalid")
            }
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 7,
        trim: true,
        validate(value) {
            if(value.toLowerCase().includes("password")) {
                throw new Error("Password can not containe password word")
            }
        }
    },
    age: {
        type: Number,
        default: 0,
        validate(value) {
            if(value < 0) {
                throw new Error("Age can not be negative")
            }
        }   
    }
})

userSchema.statics.findByCredentials = async(email, password) => {
    const user = await User.findOne({email});

    if(!user) {
        throw new error("Unable to login!");
    }

    const isMatch = await bcrypt.compare(password, user.password)

    if(!isMatch) {
        throw new error("Unable to login");
    }

    return user;

}

userSchema.pre("save", async function(next) {
    const user = this;
    
    if(user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
})

const User = mongoose.model('users', userSchema);

module.exports = User