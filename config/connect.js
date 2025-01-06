const mongoose = require('mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/ecommerce")
    .then(
        ()=>{
            console.log("database is work successfully !!");
        }
    )
    .catch(
        (err)=>{
            console.log(err);
        }
        
        )
// export the model for can import other 
module.exports=mongoose;