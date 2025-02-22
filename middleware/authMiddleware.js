module.exports = (req, res, next) => {

    if (!req.session.username) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    
    req.user = { id: req.session.userId, username: req.session.username };
    next();
};
