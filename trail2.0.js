const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyparser = require('body-parser');
const zod = require('zod');
app.use(bodyparser.json());
const myschema=zod.string();
const  jwt = require('jsonwebtoken');
let secret = "secretpassword";
mongoose.connect('mongodb+srv://manichintala:GradTime@cluster0.9769s5d.mongodb.net/');

const adminschema = new mongoose.Schema({
    username:String,
    password:String,
    auth : String
 });
 const userschema = new mongoose.Schema({
    username:String,
    password:String,
    auth : String,
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
    const username = myschema.parse(req.headers.username);
    const password = myschema.min(8).parse(req.headers.password);
    const auth = req.headers.authorization;

    Admin.findOne({auth:auth})
    .then(function(value){
        if(value){
            next()
        }else{
            res.status(403).json({msg:"invalid admin"})
        }
    })
};
 function userMiddleware(req,res,next){
    const username = myschema.parse(req.headers.username);
    const password = myschema.min(8).parse(req.headers.password);
    const auth = req.headers.authorization;
    User.findOne({auth:auth})
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
    let auth = jwt.sign({
        username:username,
        password:password
        }, secret);

   await Admin.create({
        username:username,
        password:password,
        auth:auth
    })
    res.json({
        message:"admin created sucessfully"
    });


});
app.post('/admin/signin',async(req,res)=>{
    const username = myschema.parse(req.headers.username);
    const password = myschema.min(8).parse(req.headers.password);
     let newcourse = await Admin.findOne({
       username:username,
    
    })
      res.json({
        auth:newcourse.auth
      })
    });
    app.get('/adminview',AdminMiddleware,async (req,res)=>{
        console.log("authworked")
        let  response = await Course.find({});
        res.json({
            courses : response
        })
    });

app.post('/admin/course',AdminMiddleware,async(req,res)=>{
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
app.get('/adminview',AdminMiddleware,async (req,res)=>{
    let  response = await Course.find({});
    res.json({
        courses : response
    })
});

app.post('/user/signup',async(req,res)=>{
    const username = req.body.username;
    const password = req.body.username;
    let auth = jwt.sign({
        username:username,
        password:password
        }, secret);
    User.create({
        username:username,
        password:password,
        auth:auth
    })
    res.json({
        msg : "user created"
    })
});
app.post('/user/signin',async(req,res)=>{
    const username = myschema.parse(req.headers.username);
    const password = myschema.min(8).parse(req.headers.password);
     let newcourse = await User.findOne({
       username:username,
    
    })
      res.json({
        auth:newcourse.auth
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
    const user = await User.findOne({
        username:req.headers.username
    });
    const courses =await Course.find({
        _id:{
            "$in": User.purchasedCourses
        }
    });
    res.json({
        course: courses
    })

});





const port = 3001;
app.listen(port,()=>{
    console.log(`port is listening in ${port}`)
});

