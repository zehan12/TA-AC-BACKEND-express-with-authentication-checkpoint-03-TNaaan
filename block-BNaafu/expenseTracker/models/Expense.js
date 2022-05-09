var mongoose = require("mongoose");
const Schema = mongoose.Schema

var expenseSchema = newSchema({
    expense:{type:String,require:true},
    cateygory:{type:String,require:true},
    userId:{type:String,require:true},
    start_date:String
})

module.exports = mongoose.model( "Income", expenseSchema );