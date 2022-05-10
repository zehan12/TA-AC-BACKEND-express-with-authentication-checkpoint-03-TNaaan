var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var bcrypt = require( 'bcrypt' );

var userSchema = new Schema(
    {
    name:{ type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: {type:String},
    age: {type:Number},
    phone: { type: String, minlength: 10, maxlength: 13 },
    country: { type: String },
    verified: { type:Boolean, default:false }
    },
    { timestamps: true }
);

userSchema.pre( 'save', function( next ){
    if ( this.password && this.isModified( "password" ) ) {
        bcrypt.hash( this.password, 10, ( err, hashed ) => {
            console.log("password hashed")
            if ( err ) return next( err );
            this.password = hashed;
            next();
        })
    } else {
        next();
    }
} );

userSchema.methods.verifyPassword = function( password, cb ) {
    bcrypt.compare( password, this.password, ( err, result ) => {
        return cb( err, result )
    } )
}

module.exports = mongoose.model( "User", userSchema );