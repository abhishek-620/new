const mongoose= require("mongoose");

//book schema
const PublicationSchema = mongoose.Schema({
  id: Number,
  name: String,
  books:[String]
});

//creating a book model
const PublicationModel = mongoose.model("publications",PublicationSchema);
module.exports = PublicationModel;
