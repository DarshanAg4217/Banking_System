const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const { sendRegistrationEmail, sendLoginEmail } = require('../services/email.service');
const tokenBlackListModel = require('../models/blackList.model');


async function userRegisterController(req, res) {

    const { email, name, password } = req.body;

    try {
        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: 'Email already in use. Please use a different email address.',
                status: 'failed'
            })
        }

        const user = await userModel.create({ email, name, password });


        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

        res.cookie("jwt_token", token, { httpOnly: true })

        res.status(201).json({
            user: {
                _id: user._id,
                email: user.email,
                name: user.name

            },
            message: 'User registered successfully',
            status: 'success',
            token
        })

        // Send registration email

        await sendRegistrationEmail(user.email, user.name);

    }
    catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({
            message: 'An error occurred while registering the user. Please try again later.'
        })
    }
}

async function userLoginController(req, res) {

    const { email, password } = req.body;

    try {
        const user = await userModel.findOne({ email }).select('+password');

        if (!user) {
            return res.status(400).json({
                message: 'Invalid email or password',
                status: 'failed'
            })
        }

        const isPasswordvalid = await user.comparePassword(password);

        if (!isPasswordvalid) {
            return res.status(400).json({
                message: 'Invalid email or password',
                status: 'failed'
            })
        }

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET)

        res.cookie("jwt_token", token, { httpOnly: true })

        res.status(200).json({
            user: {
                _id: user._id,
                email: user.email,
                name: user.name
            },
            message: 'User logged in successfully',
            status: 'success',
            token
        })

        // Send login email
        await sendLoginEmail(user.email, user.name);

    }
    catch (err) {
        console.error('Error logging in user:', err);
        res.status(500).json({
            message: 'An error occurred while logging in the user. Please try again later.'
        })
    }
}

async function userLogoutController(req, res) {


    const token = req.cookies.jwt_token || req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(400).json({
            message: 'No token found',
            status: 'failed'
        })
    }


    await tokenBlackListModel.create({
        token: token
    })


    res.clearCookie('jwt_token')

    res.status(200).json({
        message: 'User logged out successfully',
        status: 'success'
    })


    // const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    // const blackList = new tokenBlackListModel({
    //     token: token,
    //     userId: decodedToken.userId
    // })
    // await blackList.save();
    // res.clearCookie('jwt_token');
}



module.exports = {
    userRegisterController,
    userLoginController,
    userLogoutController
}