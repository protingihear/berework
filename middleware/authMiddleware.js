module.exports = (req, res, next) => {

    if (!req.session.username) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    
    req.user = req.session.username; // Simpan user ke request
    next();
};
