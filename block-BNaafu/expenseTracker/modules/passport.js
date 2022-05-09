const passport = require('passport');
const User = require('../models/User');

var GitHubStrategy = require('passport-github2').Strategy;
var GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GitHubStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/github/callback",
    scope: [ 'user:email' ]
    },
    async (accessToken, refreshToken, profile, cb)=>  {
        console.log(profile);
        var profileData = {
            name : profile._json.name,
            email: profile.emails[0].value,
        };
        try {
            const user = await User.findOne({email :  profile.emails[0].value });
            if(!user){
                const addedUser = await User.create(profileData);
                return cb(null, addedUser);
            }
            return cb(null,user);
        } catch (error) {
            return cb(error);
        }
    }
));

    passport.use( new GoogleStrategy( {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: 'http://localhost:3000/auth/google/callback'
    }, 

    // https://accounts.google.com/signin/oauth/error?authError=ChVyZWRpcmVjdF91cmlfbWlzbWF0Y2gSsAEKWW91IGNhbid0IHNpZ24gaW4gdG8gdGhpcyBhcHAgYmVjYXVzZSBpdCBkb2Vzbid0IGNvbXBseSB3aXRoIEdvb2dsZSdzIE9BdXRoIDIuMCBwb2xpY3kuCgpJZiB5b3UncmUgdGhlIGFwcCBkZXZlbG9wZXIsIHJlZ2lzdGVyIHRoZSByZWRpcmVjdCBVUkkgaW4gdGhlIEdvb2dsZSBDbG91ZCBDb25zb2xlLgogIBptaHR0cHM6Ly9kZXZlbG9wZXJzLmdvb2dsZS5jb20vaWRlbnRpdHkvcHJvdG9jb2xzL29hdXRoMi93ZWItc2VydmVyI2F1dGhvcml6YXRpb24tZXJyb3JzLXJlZGlyZWN0LXVyaS1taXNtYXRjaCCQAyo6CgxyZWRpcmVjdF91cmkSKmh0dHA6Ly9sb2NhbGhvc3Q6MzAwMC9hdXRoL2dvb2dsZS9jYWxsYmFjaw%3D%3D&client_id=844377857676-ou9prvnkgdltae07cvc6dnn218gvljva.apps.googleusercontent.com
    async ( accessToken, refreshToken, profile, cb ) => {
        console.log( profile );
        const newUser = {
            email: profile.emails[0].value,
            name: profile.name.familyName,
        }
        try {
            const user = await User.findOne({email :  profile.emails[0].value });
            if(!user){
                const addedUser = await User.create(profileData);
                return cb(null, addedUser);
            }
            return cb(null,user);
        } catch ( err ) {
            console.error( err );
        }
    } ) );

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});