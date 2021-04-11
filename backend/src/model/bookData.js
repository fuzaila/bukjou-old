const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/bukjou', { useNewUrlParser: true, useUnifiedTopology: true });
const Schema = mongoose.Schema;

var NewBookSchema = new Schema({
    _id : Number,
    title : String,
    author : String,
    genre : String,
    description : String,
    image : String
});

var bookData = mongoose.model('book', NewBookSchema);           //UserData is the model and NewBookData is the schema

module.exports = bookData;