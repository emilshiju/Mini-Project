var express = require('express');
var router = express.Router();
var producthelpers=require('../helpers/product-helpers')
var userhelpers=require('../helpers/user-helpers');
const { USER_COLLECTION } = require('../config/collections');

var verifyLogin=(req, res, next)=>{
  if (req.session.loggedIn) {
    next();
  } else {
    res.redirect('/login');
  }
}
/* GET home page. */
router.get('/', async function(req, res, next) {
    let user=req.session.user
    let cartCount=null;
    if(req.session.user){
      // console.log(req.session.user._id)
     cartCount=await userhelpers.getCartCount(req.session.user._id)
}
  producthelpers.getAllProducts().then((products)=>{
    res.render('user/view-products', {products,user,cartCount});
  })
  
});

router.get('/login',(req,res)=>{
  if(req.session.loggedIn){
    res.redirect('/')
  }else{
    res.render('user/login',{'loginErr':req.session.loginErr});
    req.session.loginErr=false;
  }
  
})
router.post('/login',(req,res)=>{
  userhelpers.dologin(req.body,(callback)=>{
    if(callback.status){
      req.session.loggedIn=true;
      req.session.user=callback.user
      res.redirect('/')
    }else{
      req.session.loginErr=true;
      res.redirect('/login')
    }
  })
})
router.get('/logout',(req,res)=>{
  req.session.destroy()
  res.redirect('/')
})

router.get('/signup',(req,res)=>{
  res.render('user/signup')
})

router.post('/signup',(req,res)=>{
  console.log(req.body)
  userhelpers.doSignup(req.body).then((response)=>{
    console.log(response)
    req.session.loggedIn=true;
    req.session.user=response
    res.redirect('/')
  })
})

router.get('/cart',verifyLogin,async (req,res)=>{
  let products=await userhelpers.getCartProducts(req.session.user._id)
  console.log(products)
  res.render('user/cart',{products,user:req.session.user})
})

router.get('/add-to-cart/:id',(req,res)=>{
  console.log("api call")
  userhelpers.addToCart(req.params.id,req.session.user._id).then(()=>{
    // res.redirect('/')
    console.log("correct")
    // res.json({status:true})
  })
})

router.post('/change-product-quantity',(req,res,next)=>{
  console.log("yehyehyeh")
  const cartIds = req.body.cart.split(',');
  console.log(cartIds)
  userhelpers.changeProductQuantity(req.body).then(()=>{})
})


module.exports = router;
