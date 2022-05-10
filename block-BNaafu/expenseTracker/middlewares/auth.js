// middlewares/auth.js
module.exports = {
    isUserLogged: (req, res, next) => {
    if ( req.session.userId ) {
        next();
    } else if  ( req.session.passport.user ) {
        next();
    } 
    else {
        res.redirect("/users/login");
    }
    },
};