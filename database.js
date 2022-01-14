const books = [
  {
  ISBN: "12345Book",
  title: "getting stated with MERN",
  pubDate: "2021-11-25",
  language: "en",
  numPage: 250,
  author: [1,2],
  publication: [1],
  category: ["tech","programming","education"]
  }
];

const author = [
  {
    id: 1,
    name:"Abhishek",
    books:["12345Book","MyBook"]
  },
  {
    id: 2,
    name: "krishna",
    books: ["12345Book"]
  }
];

const publication = [
  {
    id: 1,
    name:"writex",
    books:["12345Book"]
  },
  {
    id:2,
    name:"writex2",
    books:[]
  }
];

module.exports = {books, author, publication};
