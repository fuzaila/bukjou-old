const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/bukjou');
const Schema = mongoose.Schema;

var ExistingUserSchema = new Schema({
    Email : String,
    Password : String
});

var userData = mongoose.model('user', ExistingUserSchema);        

module.exports = userData;