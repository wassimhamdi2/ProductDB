const express = require('express');
const User = require('../models/user');
const router= express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// login methode 
router.post('/login', async (req, res) => {
    try {
        const data = req.body;

        const user = await User.findOne({ email: data.email });

        if (!user) {
            return res.status(404).send('Email or password invalid!');
        }

        const validPass = bcrypt.compareSync(data.password, user.password);

        if (!validPass) {
            return res.status(401).send('Email or password invalid!');
        } else {
            const payload = {
                _id: user._id,
                email: user.email,
                name: user.name
            };

            const token = jwt.sign(payload, '1234567');

            return res.status(200).send({ mytoken: token });
        }
    } catch (err) {
        res.status(500).send(err);
    }
});

//add user methode 1
router.post('/register', async (req, res) => {
    try {
        const data = req.body;
        const usr = new User(data);

        const salt = bcrypt.genSaltSync(10);
        const cryptedPass = await bcrypt.hashSync(data.password, salt);
        
        usr.password = cryptedPass;

        usr.save()
            .then(saved => {
                res.status(200).send(saved);
            })
            .catch(err => {
                res.status(400).send(err);
            });
    } catch (err) {
        res.status(500).send(err);
    }
});

//add user methode 2
router.post('/create',async(req,res)=>{
    try{
        data = req.body
        usr = new User(data)
        let savedData = await usr.save()
        res.status(200).send(savedData)
        //console.log(savedData)
    }
    catch(error){
        res.status(400).send(error)
    }
})


//get users methode 1
router.get("/getall",(req,res)=>{
    User.find()
    .then(
        (Users)=>{res.status(200).send(Users)}    
)
    .catch((err)=>{
        res.status(400).send(err)
    })
});

//get users methode 2
router.get("/getUsers",async(req,res)=>{
    try{
        Users = await User.find()
        res.status(200).send(Users)
        //console.log(Users)
    }
    catch(error){
        res.status(400).send(error)
    }
});

//getbyid users methode 1
router.get("/getbyid/:id",(req,res)=>{
    myid=req.params.id;
    User.findById(myid)
    .then(
        (usser)=>{ res.status(200).send(usser)}
    )
    .catch((err)=>{res.status(400).send(err)})
    
});

//getbyid users methode 2
router.get("/getUsersid/:id",async(req,res)=>{
    try{
        myid=req.params.id;
        usser= await User.findOne({_id : myid});
        res.status(200).send(usser)
        //console.log(Users)
    }
    catch(error){
        res.status(400).send(error)
    }
});

//update user data methode 1
router.put("/update/:id",(req,res)=>{
    myid=req.params.id;
    myData=req.body;
    User.updateOne({_id : myid }, myData )
    .then((Nuser)=>{
        res.status(200).send(Nuser)
    })
    .catch((err)=>{
        res.status(400).send(err)
    })
});

//update user data methode 2
router.put("/updateUser/:id",async(req,res)=>{
    try{
        myid=req.params.id;
        myData=req.body;
        const Nuser= await User.findByIdAndUpdate({_id:myid},myData)
        res.status(200).send(Nuser)

    }
    catch(error){
        res.status(400).send(error)
    }
});


//delete user from his id methode 1
router.delete("/delete/:id",(req,res)=>{
    myid=req.params.id;
    User.findByIdAndDelete({_id : myid})
    .then(
        (userr)=>{ res.status(200).send(userr)}
    )
    .catch((err)=>{res.status(400).send(err)})
    
});

//delete user from his id methode 2
router.delete("/deleteUser/:id",async(req,res)=>{
    try{
        myid=req.params.id;
        const userr= await User.deleteOne({_id:myid})
        res.status(200).send(userr)

    }
    catch(error){
        res.status(400).send(error)
    }
});

module.exports = router;