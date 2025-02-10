const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.register = async (req, res) => {
    try {
        const { firstname, lastname, email, username, password, role } = req.body;
        const user = await User.create({ firstname, lastname, email, username, password, role });
        res.status(201).json({ message: 'User registered', user });
    } catch (error) {
        res.status(500).json({ message: 'Error registering user', error });
    }
};

exports.login = async (req, res) => {
    try {
	
        const { email, password } = req.body;
	console.log("sini")
        const user = await User.findOne({ where: { email } });
	

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        req.session.user = user;
        res.json({ message: 'Login successful', user });
	console.log("Session Data:", req.session);
	
    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
    
};
