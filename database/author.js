const mongoose= require("mongoose");

//book schema
const AuthorSchema = mongoose.Schema({
  id: Number,
  name: String,
  books:[String]
});

//creating a book model
const AuthorModel = mongoose.model("authors",AuthorSchema);
module.exports = AuthorModel;
