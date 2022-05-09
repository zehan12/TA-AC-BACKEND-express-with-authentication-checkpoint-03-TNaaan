var express = require('express');
var router = express.Router();
const passport = require('passport');
var auth = require("../middlewares/auth");

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get( '/dashboard', auth.isUserLogged, ( req, res, next ) => {
  try {
    var userId = req.session.passport.user || req.session.userId
    if ( userId ){
      console.log("userId in session",userId)
    }
    res.render( "index/dashboard" );
  } catch (err) {
    return next(err)
  }
});

router.get( '/auth/github', passport.authenticate( 'github', { scope: [ 'user:email' ] } ) );

router.get( '/auth/github/callback', 
  passport.authenticate( 'github', 
  { failureRedirect : '/users/login' } ), 
  async (req,res,next)=> {
    try {
      res.redirect('/dashboard');
    } catch (error) {
      next(error);
    }
  }
)

router.get( '/auth/google', passport.authenticate( 'google', { scope: ['email', 'profile'] }) );
  
router.get('/auth/google/callback',
    passport.authenticate( 'google', 
    { failureRedirect: '/users/login' } ), 
    async (req,res,next)=> {
      try {
        res.redirect('/dashboard');
      } catch (error) {
        next(error);
      }
    }
);



module.exports = router;
