const express = require('express');
const Product = require('../models/product');
const router= express.Router();
const multer = require("multer");
const fs = require('fs');

filename ="";
const mystorage = multer.diskStorage({
    destination:'./uploads',
    filename:(req,file,redirect)=>{
        let date = Date.now();

        let fi = date +'.'+file.mimetype.split('/')[1];
        redirect(null,fi);
        filename=fi;
    }
})

const upload = multer ({storage:mystorage});

//add product methode 1
router.post("/addprod",upload.any('image'),(req,res)=>{
    data = req.body
    usr = new Product(data);
    usr.image=filename
    usr.save()
    .then(
        (SavedData)=>{
            res.status(200).send(SavedData);
            console.log(SavedData);
            filename='';
        }
    )
    .catch(
        (err)=>{
            res.status(400).send(err)
        }
    )
});

//add user methode 2
router.post('/createprod',upload.any('image'),async(req,res)=>{
    try{
        data = req.body
        usr = new Product(data)
        usr.image=filename
        let savedData = await usr.save()
        res.status(200).send(savedData)
        //console.log(savedData)
        filename='';
    }
    catch(error){
        res.status(400).send(error)
    }
})


//get product methode 1
router.get("/getallprod",(req,res)=>{
    Product.find()
    .then(
        (Users)=>{res.status(200).send(Users)}    
)
    .catch((err)=>{
        res.status(400).send(err)
    })
});

//get products methode 2
router.get("/getproducts",async(req,res)=>{
    try{
        Products = await Product.find()
        res.status(200).send(Products)
        //console.log(Users)
    }
    catch(error){
        res.status(400).send(error)
    }
});

//getbyid products methode 1
router.get("/getprodbyid/:id",(req,res)=>{
    myid=req.params.id;
    Product.findById(myid)
    .then(
        (usser)=>{ res.status(200).send(usser)}
    )
    .catch((err)=>{res.status(400).send(err)})
    
});

//getbyid products methode 2
router.get("/getproductsid/:id",async(req,res)=>{
    try{
        myid=req.params.id;
        usser= await Product.findOne({_id : myid});
        res.status(200).send(usser)
    }
    catch(error){
        res.status(400).send(error)
    }
});

//update product data methode 1
router.put("/updateprod/:id",(req,res)=>{
    myid=req.params.id;
    myData=req.body;
    Product.updateOne({_id : myid }, myData )
    .then((Nuser)=>{
        res.status(200).send(Nuser)
    })
    .catch((err)=>{
        res.status(400).send(err)
    })
});

//update product data methode 2
router.put("/updateproducts/:id",async(req,res)=>{
    try{
        myid=req.params.id;
        myData=req.body;
        const Nuser= await Product.findByIdAndUpdate({_id:myid},myData)
        res.status(200).send(Nuser)

    }
    catch(error){
        res.status(400).send(error)
    }
});


//delete product from his id methode 1
router.delete("/deleteprod/:id",(req,res)=>{
    myid=req.params.id;
    Product.findByIdAndDelete({_id : myid})
    .then(
        (userr)=>{ res.status(200).send(userr)}
    )
    .catch((err)=>{res.status(400).send(err)})
    
});


//delete file and json
router.delete('/deleteprodd/:id', async (req, res) => {
    try {
        // Find the product by ID
        const product = await Product.findById(req.params.id);

        // If the product doesn't exist, return a 404 error
        if (!product) {
            return res.status(404).send({ message: "Product not found" });
        }

        // Delete the product image from the file system
        if (product.image) {
            fs.unlinkSync(`./uploads/${product.image}`);
        }

        // Delete the product from the database
        await Product.findByIdAndDelete(req.params.id);

        // Return a success message
        res.status(200).send({ message: "Product deleted successfully" });
    } catch (error) {
        res.status(500).send({ message: "Error deleting product", error });
    }
});
module.exports = router;