// middlewares/auth.js
module.exports = {
    isUserLogged: (req, res, next) => {
    var userId = req.session.passport.user || req.session.userId ;
    if ( userId ) {
        next();
    } else {
        res.redirect("/users/login");
    }
    },
};