var mongoose = require("mongoose");
const Schema = mongoose.Schema

var expenseSchema = new Schema({
    expense:{type:Number,require:true},
    category:{type:String,require:true},
    userId:{type:String,require:true},
    date:String
})

module.exports = mongoose.model( "Expense", expenseSchema );