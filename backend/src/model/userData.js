const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/bukjou', { useNewUrlParser: true, useUnifiedTopology: true });
const Schema = mongoose.Schema;

var ExistingUserSchema = new Schema({
    name: String,
    email: String,
    password: String,
    dob: Date,
    Favorites: Array,
    Books: Array
});

// var NewUserSchema = new Schema({
//     Name: String,
//     Email: String,
//     Password: String,
//     Dob: Date,
//     Favorites: Array,
//     Books: Array
// })

var userData = mongoose.model('user', ExistingUserSchema); 
// var newuserData = mongoose.model('user', NewUserSchema);        

module.exports = userData;
// module.exports = newuserData;