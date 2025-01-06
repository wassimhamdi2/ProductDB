//use npm init for create package.json that saved the information of the project
//importation de express libreray
const express = require('express');

//import of routers
const productRouter = require("./routers/product") ;
const userRouter = require("./routers/user") ;

//create extention
const app = express();

//access for read json 
app.use(express.json());

//import mongoose
 require('./config/connect');

//create endpoint for routers
app.use('/product',productRouter); //http://127.0.0.1:3000/product/getproducts
app.use('/user',userRouter);  //http://127.0.0.1:3000/product/getusers

//end point for get images
app.use('/getimage',express.static('./uploads'));

//open the app in port 3000 
app.listen(3000,()=>{
    console.log("server work !!!");
});