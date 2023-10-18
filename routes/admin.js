var express = require('express');
var router = express.Router();
var producthelpers=require('../helpers/product-helpers')
var path=require('path')


/* GET users listing. */
router.get('/', function(req, res, next) {
     
    producthelpers.getAllProducts().then((products)=>{
      console.log(products)
      res.render('admin/view-products',{admin:true,products})
    })
  
});


router.get('/add-product',(req,res)=>{
  res.render('admin/add-products')
})

router.post('/add-product',(req,res)=>{
  console.log(req.body)
  console.log(req.files.image)
  producthelpers.addproduct(req.body,(id)=>{
    let image=req.files.image
    const filePath = path.join(__dirname, '../public/product-images/', id + '.jpg');
    image.mv(filePath,(err,data)=>{
      if(!err){
        res.render('admin/add-products')
      }else{
        console.log(err)
      }
    })

    
  })
 
  
})

router.get('/delete-product/:id',(req,res)=>{
  const prdId=req.params.id;
  
  console.log(req.params.id)
  producthelpers.deleteProduct(prdId).then((response)=>{
    console.log(response)
    res.redirect('/admin')
  })
})


router.get('/edit-product/:id',async (req,res)=>{
  let products= await producthelpers.getProductDetails(req.params.id)
  console.log(products)
  res.render('admin/edit-products',{products})
})

router.post('/edit-products/:id',async (req,res)=>{
  let id=req.params.id
  let products=await producthelpers.updateProducts(req.params.id,req.body).then(()=>{
    res.redirect('/admin')
    if(req.files.image){
      let image=req.files.image
      const filePath = path.join(__dirname, '../public/product-images/', id + '.jpg');
      image.mv(filePath)
    }

  })
})

module.exports = router;
