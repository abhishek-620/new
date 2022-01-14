require("dotenv").config();
const express = require("express");
const mongoose= require("mongoose");
var bodyParser = require("body-parser");

//database
const database = require("./database");

//models
const BookModel = require("./database/book");
const AuthorModel = require("./database/author");
const PublicationModel = require("./database/publication");

//initialize express
const booky = express();
booky.use(bodyParser.urlencoded({extended: true}));
booky.use(bodyParser.json());

//establish database connection
mongoose.connect(
  process.env.MONGO_URL

).then(() => console.log("connection established!!!"));



//get all books
/*
route              /
description     get all books
access         public
parameter      none
methods      get
*/

booky.get("/", async (req,res) => {
  const getAllBooks = await BookModel.find();
return res.json(getAllBooks);
});

//get a specific book localhost:/12345Book
/*
route              /is
description     get specific  book
access         public
parameter      isbn
methods      get
*/

booky.get("/is/:isbn", async (req,res) => {
  const getSpecificBook = await BookModel.findOne({ISBN:req.params.isbn});

  if(!getSpecificBook){
    return res.json({
      error:`No book found for ISBN of ${req.params.isbn}`
    });
  }
  return res.json(getSpecificBook);
});


//get books on a specific category localhost:/12345Book
/*
route              /c
description       get specific book
access             public
parameter        category
methods           get
*/
booky.get("/c/:category", (req,res) => {
  const getSpecificBook = database.books.filter((book) =>
     book.category.includes(req.params.category)
  );
  if(getSpecificBook.length === 0){
    return res.json({
      error:`No book found for category  of ${req.params.category }`
    });
  }
  return res.json({book:getSpecificBook});
});

//get all authors
/*
route              /author
description     get all authors
access         public
parameter      none
methods      get
*/
booky.get("/author", (req,res)=> {
  return res.json({authors:database.author});
});

//get all authors based on a book
/*
route              /author/book
description     get all authors based on book
access         public
parameter      isbn
methods      get
*/
booky.get("/author/book/:isbn", (req,res) => {
  const getSpecificAuthor = database.author.filter((author) =>
     author.books.includes(req.params.isbn)
  );
  if(getSpecificAuthor.length === 0){
    return res.json({
      error:`No author found for isbn  of ${req.params.isbn }`
    });
  }
  return res.json({authors:getSpecificAuthor});
});

//get all publication
/*
route              /publication
description     get all publications
access         public
parameter      none
methods      get
*/

booky.get("/publications",(req,res)=> {
  return res.json({publications:database.publication});
});

//add new books
/*
route              /book/new
description     get new books
access         public
parameter      none
methods      post
*/

booky.post("/book/new",(req,res) =>{
  const newBook = req.body;
  database.books.push(newBook);
  return res.json({updatedBooks:database.books});
});

//add new authors
/*
route              /author/new
description     get new authors
access         public
parameter      none
methods      post
*/

booky.post("/author/new",(req,res) =>{
  const newAuthor = req.body;
  database.author.push(newAuthor);
  return res.json({updatedAuthor:database.author});
});

//add new publications
/*
route              /publication/new
description     get new publications
access         public
parameter      none
methods      post
*/

booky.post("/publication/new",(req,res) =>{
  const newPublication= req.body;
  database.publication.push(newPublication);
  return res.json({updatedPublications:database.publication});
});

//update publication and book
/*
route              /publication/update/book/
description     update the pub and book
access         public
parameter      isbn
methods      put
*/
booky.put("/publication/update/book/:isbn",(req,res) =>{
  //update the publication database
  database.publication.forEach((pub) => {
    if(pub.id === req.body.pubId){
      return pub.books.push(req.params.isbn);
    }


  });
  //update the book database
  database.books.forEach((book) =>{
    if(book.ISBN ==req.params.isbn) {
      book.publications = req.body.pubId;
      return;
    }
});
return res.json(
  {
    books:database.books,
    publications:database.publication,
    massage:"Successfully updated!"
  }
)

});
//DELETE A book
/*
route              /book/DELETE
description     DELETE A BOOK
access         public
parameter      isbn
methods         DELETE
*/
booky.delete("/book/delete/:isbn",(req,res) =>{
  const updatedBookDatabase = database.books.filter(
    (book) => book.ISBN !== req.params.isbn
  )
  database.books = updatedBookDatabase;
  return res.json({books:database.books});
});

//DELETE An authors from a book and vise versa
/*
route              /book/DELETE/author
description     DELETE  An authors from a book and vise versa
access         public
parameter      isbn,authorId
methods         DELETE
*/
booky.delete("/book/delete/author/:isbn/:authorId" , (req,res) =>{
  //update the book database
   database.books.forEach((book) =>{
     if(book.ISBN === req.params.isbn){
         const newAuthorList = book.author.filter(
           (eachAuthor) => eachAuthor !== parseInt(req.params.authorId)
         );
         book.author = newAuthorList;
         return;
}

});
//update the author database
 database.author.forEach((eachAuthor) =>{
   if(eachAuthor.id === parseInt(req.params.authorId)){
       const newBookList = eachAuthor.books.filter(
         (book) => book !== req.params.isbn
       );
       eachAuthor.books = newBookList;
       return;
     }
});
  return res.json({
    book:database.books,
    author:database.author,
    massage:"Author and book were deleted !!!"
  });
});
booky.listen(3000,() => console.log("the server is up and running"));
