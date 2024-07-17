const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const validator = require('validator');

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        validate: [validator.isEmail, 'Please provide a valid email address']
    },
    password: {
        type: String,
        required: true,
        validate: {
            validator: function (value) {
              return validator.isStrongPassword(value, {
                minLength: 8,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1,
              });
            },
            message: () => `Password must be at least 8 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.`,
          },
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

userSchema.pre("save", async function (next) {
    const user = this;
    if (user.isModified('password')) {
        try {
            const hash = await bcrypt.hash(user.password, 10);
            user.password = hash;
        } catch (err) {
            return next(err);
        }
    }
})

userSchema.methods.checkPassword = async function (enteredPassword) {
    try {
        return await bcrypt.compare(enteredPassword, this.password);
    } catch (error) {
        throw error
    }
}

userSchema.methods.withoutPassword = function () {
    const user = this.toObject()
    delete user.password
    return user
}

module.exports = mongoose.model('User', userSchema);