 const isAdmin = (req, res, next) => {
    console.log(req.user);
    if (req.user.role !== "admin" && req.user.role !== "superadmin" ) return res.status(403).json({ message: "Access denied" });
    next();
};

module.exports = isAdmin;