var express = require('express');
var router = express.Router();
const User = require("../models/User");
const Token = require("../models/token");
const crypto = require("crypto");
const sendEmail = require("../utils/email");


/* GET users listing. */
//* desc        /users index
//* route       GET /users
router.get( '/', function(req, res, next) {
  // console.log(req.session,req.user);
  console.log("logedin user:", req.session,req.user);
  console.log("USER SESSION ID:", req.session.userId)
  console.log("USER PASSPORT ID:",req.session.passport.user);
  res.send('respond with a resource');
});

//* desc        Registeration Page 
//* route       GET /users/register
router.get( '/register', ( req, res, next )=>{
  var error = req.flash('error')[0];
  console.log(error)
  res.render( "users/register", {error} );
})

//! create user function
async function createUser( req, res, next ){
  try {
    // const { email } = req.body;
    // const uniqueStr = randomStr();
    // const isValid = false;

    // const newUser = new User( isValid, uniqueStr, ...req.body );
    // await newUser.save() 
    // sendEmail( email );
    // if ( newUser ) {
    //   res.resdirect( '/users/login' );
    // }

    // //* new 
    // const user = await new User({
    //   name: req.body.name,
    //   email: req.body.email,
    //   }).save();

    //   const token = await new Token({
    //     userId: user._id,
    //     token: crypto.randomBytes(32).toString("hex"),
    //   }).save();

    //   const message = `${process.env.BASE_URL}/user/verify/${user.id}/${token.token}`;
    //   await sendEmail(user.email, "Verify Email", message);
    //   res.send("An Email sent to your account please verify");
    const user = await User.create( req.body )
    if ( user ) {
      res.redirect( '/users/login' );
    }
  } catch ( error ){
    return next(error);
  }
};


router.get("/verify/:id/:token", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) return res.status(400).send("Invalid link");

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send("Invalid link");

    await User.updateOne({ _id: user._id, verified: true });
    await Token.findByIdAndRemove(token._id);

    res.send("email verified sucessfully");
  } catch (error) {
    res.status(400).send("An error occured");
  }
});

//* desc        create a user
//* route       POST /users/register
router.post( '/register', async( req, res, next ) => {
  console.log(req.body);
  var { email, password, age, phone } = req.body;

  if ( email ) {
  try{
      const user = await User.findOne( { email })
      if ( !user ) {
          if ( password.length <= 4 ){
          req.flash( 'error', 'Password is Short' );
          return res.redirect( '/users/register' );
          }
          else if ( !email.includes("@") ) {
          req.flash( 'error', 'email is incorrect'  );
          return res.redirect( '/users/register' );
          }
          else {
          return createUser( req, res, next );
          }
      }
      else {
      req.flash( 'error', 'This email already registered & login here' );
      return res.redirect( '/users/login' );
      }
  } catch (error){
      return next( error );
  }
}
  else {
    req.flash( 'error', "Email required" );
    return res.redirect( '/users/register' );
  }
} );

//* desc        Login Page 
//* route       GET /users/login
router.get( '/login', ( req, res, next ) => {
  var error = req.flash('error')[0];
  console.log(error)
  res.render( "users/login", { error } );
} );

//* desc        Login a created user
//* route       POST /users/login
router.post( '/login', ( req, res, next ) => {
  var { email, password } = req.body;
  if ( !email || !password ) {
    req.flash('error', 'Email/Password required');
    return res.redirect( '/users/login' );
  } 
  User.findOne( { email }, ( err, user ) => {
    if ( err ) return next( err );
    if ( !user ) {
      req.flash( 'error', 'User Not Found!!!' )
      return res.redirect( '/users/login' );
    }

    user.verifyPassword( password, ( err, result ) => {
      console.log(result);
      if ( err ) return next( err );
      if ( !result ) {
        req.flash( 'error', 'Password is incorrect' )
        return res.redirect( '/users/login' )
      }

      // login user
      console.log("user login");
      req.session.userId = user.id;
      res.redirect( '/dashboard' );
    } )
  } )
} );

//* desc        logout a user  
//* route       GET /users/logout
router.get( '/logout', ( req, res, next ) => {
  req.session.destroy();
  res.clearCookie( 'connect.sid' );
  console.log("USER LOGOUT")
  res.redirect( '/users/login' );
} );

module.exports = router;
