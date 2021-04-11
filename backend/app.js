const express = require("express");
const blogData = require("./src/model/blogData");
const bookData = require("./src/model/bookData");
const userData = require("./src/model/userData");
var bodyParser = require('body-parser');
const cors = require("cors");
const jwt = require('jsonwebtoken');
var app = new express();
app.use(cors());
app.use(express.json());

app.use(bodyParser.urlencoded(
    {
        extended: true
    }
    ));

adminemail = "admin@gmail.com";
adminpass = "1234567";

function verifyToken(req, res, next)
{
    if(!req.headers.authorization)
    {
        return res.status(401).send('Unauthorized request')
    }
    let token = req.headers.authorization.split('')[1]
    
    if(token == 'null')
    {
        return res.status(401).send('Unauthorized request')
    }

    let payload = jwt.verify(token, 'secretKey')
    console.log(payload)
    if(!payload)
    {
        return res.status(401).send('Unauthorized request')
    }

    req.userId = payload.subject
    next()
}

app.post("/admin", (req,res)=>{
    let adminData = req.body;

    if(adminemail != adminData.adminemail)
    { 
        res.status(401).send("Invalid admin");
    }
    else if(adminpass !== adminData.adminpass) 
    {
        res.status(401).send("Invalid password ");
    }
    else
    {
        let payload = {subject: adminemail + adminpass}
        let token = jwt.sign(payload, 'secretKey')  
        res.status(200).send({token})
    }
})

app.get('/books',function(req,res){
    
    bookData.find()
                .then(function(books){
                    res.send(books);
                });
});

app.post('/addbook', function(req,res){
    res.header('Access-Control-Allow-Origin','*')
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE,OPTIONS');
    console.log(req.body);
    var item = {
        _id: req.body.book.id,
        title: req.body.book.title,
        author: req.body.book.author,
        genre: req.body.book.genre,
        description: req.body.book.description,
        image: req.body.book.image
    }
    var book = bookData(item);
    book.save();
})

app.post('/updatebook', function(req,res){
   id = req.body.book._id;
   title = req.body.book.title;
   author = req.body.book.author;
   genre = req.body.book.genre;
   description = req.body.book.description;
   image = req.body.book.image;
   console.log(title);
   bookData.findByIdAndUpdate( id, {"title": title, "author": author, "genre": genre, "description": description, "image": image})
   .then(book=>{
    if(book){
        res.send(); }
    })
})

app.post('/deletebook', function(req,res){
   console.log(req.body);
   id = req.body.book._id;
   bookData.findByIdAndDelete({"_id": id})
   .then(()=>{
       res.send();
   })
})

app.get('/blogs',function(req,res){
    
    blogData.find()
                .then(function(blogs){
                    res.send(blogs);
                });
});

app.post('/addblog', function(req,res){
    res.header('Access-Control-Allow-Origin','*')
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE,OPTIONS');
    console.log(req.body);
    var item = {
        title: req.body.blog.title,
        date: req.body.blog.date,
        brief: req.body.blog.brief,
        link: req.body.blog.link
    }
    var blog = blogData(item);
    blog.save();
})

app.post("/user", (req,res)=>{

    let item = {
        email: req.body.useremail,
        password: req.body.userpass
    }

    userData.findOne({email: item.email, password: item.password})
    .then(user=>{
        if(user){
            let payload = {subject: user.email + user.password}
            let usertoken = jwt.sign(payload, 'secretKey')  
            let id = user._id
            res.status(200).send({usertoken, id})
        }
        else{
            console.log("Wrond credentials");
            res.status(401).send("Invalid username and password");
        }
    })
})


app.listen(3000);