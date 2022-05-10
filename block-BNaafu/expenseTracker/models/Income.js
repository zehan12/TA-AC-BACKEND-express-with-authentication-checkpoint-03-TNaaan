var mongoose = require("mongoose");
const Schema = mongoose.Schema

var incomeSchema = new Schema({
    income:{type:Number,require:true},
    source:{type:String,require:true},
    userId:{type:String,require:true},
    date:String
})

module.exports = mongoose.model( "Income", incomeSchema );