const express = require('express');
const router = express.Router();
const passport = require('passport');
const auth = require("../middlewares/auth");
const Income = require("../models/Income");
const Expense = require("../models/Expense");

const selectOption = async( req, res, next ) => {
  let userId = req.session.userId || req.session.passport.user
  console.log(userId,"id present")
  const income = await Income.distinct("source");
  const expense = await Expense.distinct("category");
  res.locals.expense = expense;
  res.locals.income = income;
  next();
}


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get( '/dashboard', auth.isUserLogged, selectOption,  async( req, res, next ) => {
  let userId = req.session.userId || req.session.passport.user
  console.log(res.locals.income,res.locals.expense)
  const incomeType = res.locals.income;
  const expenseCate  = res.locals.expense;
  try {
    // const incomeType = await Income.find().distinct("source");
    const income = await Income.find()
    const expense = await Expense.find()
    // const expenseCate = await Expense.find().distinct("category");
    res.render( "index/dashboard", { income, expense, incomeType, expenseCate } );
  } catch (err) {
    // return next(res.redirect("/dashboard"));
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


router.get( "/search/", async( req, res, next ) => {
  console.log(req.url);
  const usp = new URLSearchParams(req.url)
  console.log(usp)
  if ( req.query.fincomeType ){
    const income = await Income.find({source:req.query.fincomeType});
    console.log(income)
    res.redirect("/dashboard");
  } else if ( req.query.fexpenseCate ){
    const expense = await Expense.find({category:req.query.fexpenseCate});
    console.log(expense);
    res.redirect('/dashboard');
  }
} )


module.exports = router;
