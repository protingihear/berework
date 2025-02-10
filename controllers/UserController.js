const User = require('../models/user');

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

exports.getUserProfile = async (req, res) => {
    try {
        const user = await User.findByPk(req.session.user.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const { firstname, lastname, email } = req.body;
        await User.update(
            { firstname, lastname, email },
            { where: { id: req.session.user.id } }
        );
        res.json({ message: 'Profile updated' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        await User.destroy({ where: { id: req.session.user.id } });
        req.session.destroy();
        res.json({ message: 'Account deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting account', error });
    }
};

exports.logout = (req, res) => {
    req.session.destroy();
    res.json({ message: 'Logged out successfully' });
};
