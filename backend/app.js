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

    if(adminemail != adminData.adminemail || adminpass !== adminData.adminpass)
    { 
        let message = "Failed"
        res.status(200).send({message});
    }
    else
    {
        let payload = {subject: adminemail + adminpass}
        let token = jwt.sign(payload, 'secretKey')  
        let message = "Success"
        res.status(200).send({token, message})
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

    bookData.findOne({_id: item._id})
    .then(book=>{
        if(book){
            let message = "Failed";
            console.log(message);
            res.status(200).send({message});
        }
        else{
            var book = bookData(item);
            book.save();
            console.log("Added book");
            let message = "Success";
            console.log(message)
            res.status(200).send({message});
        }
    })
    
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
            let message = "Success"
            res.status(200).send({usertoken, id, message})
        }
        else{
            console.log("Wrong credentials");
            let message = "Failed"
            res.status(200).send({message});
        }
    })
})

app.post('/adduser', function(req,res){
    res.header('Access-Control-Allow-Origin','*')
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE,OPTIONS');
    // console.log(req.body);
    var item = {
        name: req.body.user.name,
        email: req.body.user.email,
        password: req.body.user.password,
        dob: req.body.user.dob,
        Favorites: [],
        Books: []
    }

    console.log(item);

    userData.findOne({email: item.email, password: item.password})
    .then(user=>{
        console.log(user)
        if(user){
            let message = "Failed";
            console.log(message);
            res.status(200).send({message});
        }
        else{
            var user = userData(item);
            user.save();
            console.log("Created user");
            let message = "Success";
            res.status(200).send({message});            
        }
    })
    
})

app.post('/addfavs', function(req,res){
    res.header('Access-Control-Allow-Origin','*')
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE,OPTIONS');

    var userid = req.body.user.userid
    var favorite = req.body.book._id;
    userid = userid.replace(/:/g, '')
 
    userData.findOne({_id: userid, Favorites: favorite})
    .then(user=>{
        if(user){
            let message = "Failed"
            res.status(200).send({message});
            console.log("Book already exists in favorites!")
        }
        else{
            userData.findByIdAndUpdate(userid, {$push: { Favorites: favorite}, $addToSet: { Books: favorite}})
            .then(user=>{
                let message = "Success"
                res.status(200).send({message});
            })
        }
    })
    
})

app.post('/addread', function(req,res){
    res.header('Access-Control-Allow-Origin','*')
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE,OPTIONS');

    var book = req.body.book._id;
    var userid = req.body.user.userid
    userid = userid.replace(/:/g, '')

    userData.findOne({_id: userid, Books: book})
    .then(user=>{
        if(user){
            let message = "Failed"
            res.status(200).send({message});
            console.log("Book already exists in user's read list!")
        }
        else{
            userData.findByIdAndUpdate(userid, {$push: { Books: book}})
            .then(user=>{
                console.log("Added book of " + userid)
                let message = "Success"
                res.status(200).send({message});
            })
        }
    })
    
})

app.post('/mybooks',function(req,res){
    
    var userid = req.body.user.userid
    userid = userid.replace(/:/g, '')

    userData.findOne({_id: userid})
                .then(function(users){

                        let books = users.Books;
                        console.log(books);

                        bookData.find({'_id' : { $in: books}}) 
                        .then(function(books){
                            console.log(books)
                            res.status(200).send(books);  
                        } )
                            
                });
});

app.post('/myfavbooks',function(req,res){
    
    var userid = req.body.user.userid;
    userid = userid.replace(/:/g, '')
    console.log(userid);
    
    userData.findOne({_id: userid})
                .then(function(users){

                        let books = users.Favorites;
                        console.log(books);

                        bookData.find({'_id' : { $in: books}}) 
                        .then(function(books){
                            console.log(books)
                            res.status(200).send(books);  
                        } )
                            
                });
});

app.post('/deletemyfavs', function(req,res){
    res.header('Access-Control-Allow-Origin','*')
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE,OPTIONS');

    var userid = req.body.user.userid;
    var favorite = req.body.book._id;
    userid = userid.replace(/:/g, '')
 
    userData.findByIdAndUpdate(userid, {$pull: {Favorites: favorite}})
    .then(user=>
    {
            if(user)
            {
                let message = "Success";
                console.log(message);
                res.status(200).send({message});
            }
            else{
                    let message = "Failed";
                    console.log(message);
                    res.status(200).send({message});
                }
    })
})

app.post('/deletemybook', function(req,res){
    res.header('Access-Control-Allow-Origin','*')
    res.header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE,OPTIONS');

    var userid = req.body.user.userid;
    var book = req.body.book._id;
    userid = userid.replace(/:/g, '')
 
    userData.findByIdAndUpdate(userid, {$pull: {Books: book}})
    .then(user=>
    {
        userData.findByIdAndUpdate(userid, {$pull: {Favorites: book}})
        .then(done=>{
            if(done)
            {
                let message = "Success";
                console.log(message);
                res.status(200).send({message});
            }
            else{
                    let message = "Failed";
                    console.log(message);
                    res.status(200).send({message});
                }
        })
    })
})

app.listen(3000);