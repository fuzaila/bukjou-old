const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/bukjou', { useNewUrlParser: true, useUnifiedTopology: true });
const Schema = mongoose.Schema;

var NewBlogSchema = new Schema({
    title : String,
    date : String,
    brief : String,
    link : String,
});

var blogData = mongoose.model('blog', NewBlogSchema);           //UserData is the model and NewBookData is the schema

module.exports = blogData;