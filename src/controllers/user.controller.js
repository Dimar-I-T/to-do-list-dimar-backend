const userService = require('../services/user.service');

async function logout(req, res) {
    try {
        return res.status(200).json({
            success: true,
            message: "Successfully logged out."
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "error logout: " + error.message
        })
    }
}

async function signUp(req, res) {
    try {
        const email = req.body.email.trim().toLowerCase();
        const { password } = req.body;
        const result = await userService.signUp(email, password);
        return res.status(201).json({
            success: true,
            message: "Successfully created user",
            data: result.data
        });
    } catch (error) {
        console.log(error);
        if (error.code === '23505') {
            return res.status(400).json({ success: false, message: "Email already in use" });
        }

        return res.status(400).json({
            success: false,
            message: "error sign up: " + error.message
        })
    }
}

async function login(req, res) {
    try {
        const email = req.body.email.trim().toLowerCase();
        const { password } = req.body;
        const result = await userService.login(email, password);
        return res.status(200).json({
            success: true,
            message: "Successfully logged in.",
            data: result.data,
            token: result.token
        });
    } catch (error) {
        console.log(error.message);
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
}

module.exports = { logout, login, signUp };


