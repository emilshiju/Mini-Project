const {MongoClient}=require('mongodb')

const state={
    db:null
}
module.exports.connect=async function(done){
    try{
        const  url='mongodb://127.0.0.1:27017';
        const dbname='basic';
        // const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });
        const client = new MongoClient(url)
        await client.connect()
        console.log("connected")
        state.db=client.db(dbname);
        done()

    }catch(err){
        console.log(err+"not connected ")
        done(err)
    }
}
module.exports.get=function(){
    return state.db
}