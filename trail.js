const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const zod = require('zod');
app.use(bodyparser.json());


mongoose.connect('mongodb+srv://manichintala:GradTime@cluster0.9769s5d.mongodb.net/');

const adminschema = new mongoose.Schema({
    username:String,
    password:String
 });
 const userschema = new mongoose.Schema({
    username:String,
    password:String,
    purchasedcourses:[{
        type : mongoose.Schema.Types.ObjectId,
        ref :'course'
    }]
 });
 const courseschema = new mongoose.Schema({
    type:String,
    descreption:String,
    imagelink:String,
    price:Number
 });

const Admin = mongoose.model('Admin', adminschema);
const User = mongoose.model('User', userschema);
const Course = mongoose.model('Course', courseschema);

function AdminMiddleware(req,res,next){
    const username = req.headers.username;
    const password = req.headers.password;
    Admin.findOne({username:username,password:password})
    .then(function(value){
        if(value){
            next()
        }else{
            res.status(403).json({msg:"invalid admin"})
        }
    })
};
 function userMiddleware(req,res,next){
    const username = req.headers.username;
    const password = req.headers.password;
    User.findOne({username:username,password:password})
    .then(function(value){
        if(value){
            next()
        }else{
            res.status(403).json({msg:"invalid admin"})
        }
    })
};
 app.post('/admin/signup',async(req,res)=>{
    let username = req.body.username;
    let password = req.body.password;

   await Admin.create({
        username:username,
        password:password
    })
    res.json({
        msg:"admin created"
    })


});
console.log("hi")
app.post('/admin/course',AdminMiddleware,async(req,res)=>{
    console.log("ho")
const title = req.body.title;
const descreption = req.body.descreption;
const imagelink = req.body.imagelink;
const price = req.body.price;
let newcourse = await Course.create({
    title:title,
    descreption:descreption,
    imagelink:imagelink,
    price:price
})
  res.json({
    message:'course created sucessfully',courseId:newcourse._id
  })
});
app.get('/admin/view',AdminMiddleware,async (req,res)=>{
    let  response = await Course.find({});
    res.json({
        courses : response
    })
});

app.post('/user/signup',async(req,res)=>{
    const username = req.body.username;
    const password = req.body.username;
    User.create({
        username:username,
        password:password
    })
    res.json({
        msg : "user created"
    })
});
app.get('/users/view',userMiddleware,async (req,res)=>{
    let  response = await Course.find({});
    res.json({
        courses : response
    })
});
app.post('/courses/:courseId', userMiddleware,async (req, res) => {
    // Implement course purchase logic
    const courseId = req.params.courseId;
    const username = req.headers.username;
   await User.updateOne({
        username:username
    },{
        purchasedCourses:{
            "$push":{
                purchasedCourses: courseId
            }

        }
    });
    res.json({
        msg:'purchase complete'
    })
});

app.get('/purchasedCourses', userMiddleware, async(req, res) => {
    // Implement fetching purchased courses logic
    await User.updateOne({
        username:username
    },{
        "$push":{
            purchasedCourses: courseId
        }
    })
    res.json({
        message:"purchase complete"
    })

});





const port = 3001;
app.listen(port,()=>{
    console.log(`port is listening in ${port}`)
});

