const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Email is required for creating User'],
        trim: true,
        unique: [true, 'Email already exists, please use a different email address'],
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"]
    },
    name: {
        type: String,
        required: [true, 'Name is required for creating an account'],
    },
    password: {
        type: String,
        required: [true, 'Password is required for creating an account'],
        minlength: [6, 'Password must be at least 6 characters long'],
        select: false
    }
}
    , { timestamps: true });


/**
 * Hashes the user password before saving to database.
 * Runs only if the password field is modified.
 * Ensures plain text passwords are not stored.
 */
userSchema.pre('save', async function () {
    if (!this.isModified('password')) {
        return
    }

    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    return
})

/**
 * Compares entered password with the hashed password in database.
 * Uses bcrypt to validate user login credentials.
 * Returns true if password matches, otherwise false.
 */
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

const userModel = mongoose.model('User', userSchema);

module.exports = userModel;

