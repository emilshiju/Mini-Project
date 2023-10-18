var db=require('../config/connection')
var collection=require('../config/collections')
var {ObjectId}=require('mongodb')
module.exports={
   

    addproduct:async (product,callback)=>{
        try{
        await  db.get().collection('product').insertOne(product).then((data)=>{
            //<<<     data is inserted id     >>>
            console.log(data)
             callback(data.insertedId);
 
         })
        }catch(err){
            console.log(err)
        }
        },
        getAllProducts:()=>{
            return new Promise(async(resolve,reject)=>{
                let products= await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
                resolve(products)
            })
        },
        deleteProduct:(proId)=>{
            try{
            return new Promise(async(resolve,reject)=>{
                console.log(proId)
                await db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({_id: new ObjectId(proId)}).then((data)=>{
                    resolve(data)
                })    
            })
        }catch(err){
        console.log(err)
        }
    },
    getProductDetails:(proId)=>{
        try{
            return new Promise(async(resolve,reject)=>{
                await db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id: new ObjectId(proId)}).then((product)=>{
                    resolve(product)
                })
            })
        }catch(err){
            console.log(err)
        }
    },
    updateProducts: (proId, proDetails) => {
        return new Promise(async (resolve, reject) => {
            try {
                await db.get().collection(collection.PRODUCT_COLLECTION)
                    .updateOne(
                        { _id: new ObjectId(proId) },
                        {
                            $set: {
                                name: proDetails.name,
                                description: proDetails.description,
                                price: proDetails.price,
                                category: proDetails.category
                            }
                        }
                    )
                    .then((response) => {
                        // Resolve the outer promise to indicate successful update
                        resolve();
                    })
                    .catch((error) => {
                        reject(error);
                    });
            } catch (err) {
                // Handle any synchronous errors here
                console.log(err);
                reject(err);
            }
        });
    },
    
    
}