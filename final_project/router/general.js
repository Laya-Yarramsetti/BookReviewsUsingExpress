const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post('/register', function (req, res) {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if the username already exists
    if (users[username]) {
        return res.status(409).json({ message: "Username already exists" });
    }

    // Register the new user
    users[username] = password;
    return res.status(201).json({ message: "User registered successfully" });
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  res.send(books);
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here
  res.send(books[req.params.isbn]);
  return res.status(300).json({message: "Yet to be implemented"});
 });
  

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    let booksByAuthor = [];

    for (let key in books) {
        if (books.hasOwnProperty(key)) {
            if (books[key].author.toLowerCase() === author.toLowerCase()) {
                booksByAuthor.push(books[key]);
            }
        }
    }

    if (booksByAuthor.length > 0) {
        res.status(200).json(booksByAuthor);
    } else {
        res.status(404).json({ message: "No books found by this author" });
    }
});


// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  const title = req.params.title;
  let titles =[];

  for(let key in books){
    if(books.hasOwnProperty(key)){
        if(books[key].title.toLowerCase() === title.toLowerCase()){
        titles.push(books[key]);
        }
    }
  }

  if(titles.length > 0){
    res.status(200).json(titles);
  }
  else{
    res.status(404).json({message: "no such title is found please retry"});
  }
});



//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  let book = books[req.params.isbn];
  if(book){
    res.status(200).json(book.reviews);
  }
  else{
    res.status(404).json({message: "no such review is found please retry"});
  }
});

module.exports.general = public_users;
