var mongoose = require("mongoose");
const Schema = mongoose.Schema

var incomeSchema = newSchema({
    income:{type:String,require:true},
    source:{type:String,require:true},
    userId:{type:String,require:true},
    start_date:String
})

module.exports = mongoose.model( "Income", incomeSchema );