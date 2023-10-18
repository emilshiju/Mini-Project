var db=require('../config/connection')
var collection=require('../config/collections')
const bcrypt=require('bcrypt')
var {ObjectId}=require('mongodb')

module.exports={
    doSignup:(userData)=>{
        return new Promise(async(resolve,reject)=>{
            try{
                userData.password=await bcrypt.hash(userData.password,10)
                await db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data)=>{
                    resolve(data.insertedId)
                })
            }catch(err){
                console.log(err)
            }
        })
    },
    dologin:async (userData,callback)=>{
        try{
            let loginStatus=false;
            let response={}
            let user=await db.get().collection(collection.USER_COLLECTION).findOne({email:userData.email})
            if(user){
                bcrypt.compare(userData.password,user.password).then((status)=>{
                    
                    if(status){
                        console.log("success")
                        response.user=user
                        response.status=true
                        callback(response)
                    }else{
                        console.log("failed")
                        callback({status:false})
                    }

                })

            }else{
                console.log("failed")
                callback({status:false})
            }

        }catch(err){
            console.log(err)
        }
    },
    addToCart:(proId,userId)=>{
        let proObj={
            item:new ObjectId(proId),
            quantity:1
        }
        return new Promise(async (resolve,reject)=>{
          
            let userCart=await db.get().collection(collection.CART_COLLECTION).findOne({user:new ObjectId(userId)})
            if(userCart){
                let proExists=userCart.products.findIndex(product=> product.item==proId)
                console.log("anssssssss")
                console.log(proExists)
                if(proExists!=-1){
                    db.get().collection(collection.CART_COLLECTION)
                    .updateOne(
                        {user:new ObjectId(userId)},
                        { "products.item": new ObjectId(proId) },
                        { $inc: { "products.$.quantity": 1 } }
                      ).then(()=>{
                        resolve()
                    })
                      
                }else{
                db.get().collection(collection.CART_COLLECTION).updateOne({user:new ObjectId(userId)},
                {
                    $push:{products:proObj}
                   
                }
                ).then(()=>{
                    resolve()
                })
            }
            }else{
                let cartObj={
                    user:new ObjectId(userId),
                    products:[proObj]
                }
                console.log("else case")
                await db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response)=>{
                    resolve()
                })
            }
        })
    },
    getCartProducts:(userId)=>{
        try{
            return new Promise(async(resolve,reject)=>{
                let cartItems=await db.get().collection(collection.CART_COLLECTION).aggregate([
                    {
                        $match: {
                            products:{$exists:true}
                          }
                    },
                    {
                        $unwind:"$products"
                    },
                    {
                        $project:{
                            item:'$products.item',
                            quantity:'$products.quantity'
                        }
                    },
                    {
                        $lookup:{
                            from:collection.PRODUCT_COLLECTION,
                            localField:'item',
                            foreignField:'_id',
                            as:'product'
                        }
                    },{
                        $project:{
                            item:1,quantity:1,product:{$arrayElemAt:['$product',0]}
                        }
                    }
                ]).toArray()
                console.log(cartItems)
                console.log(cartItems[0].products)
                 resolve(cartItems);
            })
        }catch(err){
            console.log(err)
        }
    },
    getCartCount:(userId)=>{
        try{
            return new Promise(async(resolve,reject)=>{
                let count=0;
                console.log(userId)
                let cart=await db.get().collection(collection.CART_COLLECTION).findOne({user:new ObjectId(userId)})
                // console.log(cart.products)
                // console.log("yehh")
                if(cart){
                    count=cart.products.length
                    console.log(count)
                }
                resolve(count)
            })
        }catch(err){
            console.log(err)
        }
    },
    changeProductQuantity:(details)=>{
        console.log("iam coming")
        console.log(details)
        count=parseInt(details.count)
        try{
            return new Promise((resolve,reject)=>{
                db.get().collection(collection.CART_COLLECTION)
                    .updateOne(
                        {_id:new ObjectId(details.cart),
                        "products.item": new ObjectId(details.product) },
                        { $inc: { "products.$.quantity": count } }
                      ).then(()=>{
                        resolve()
                    })
                      
            })
        }catch(err){
            console.log(err)
        }
    }
}


