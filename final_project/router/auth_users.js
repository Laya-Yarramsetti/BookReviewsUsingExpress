const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
if(users[username]){
    return true;
}
else{
    return false;
}
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.
if(isValid(username) && users[username] === password){
    return true;
}
else{
    return false;
}
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here
  const {username, password} = req.body;
  console.log(authenticatedUser(username, password));
  if(authenticatedUser(username, password)){
    res.status(200).json({message: "loggedin"})
  }
  else {
    res.status(400).json({message: "Yet to be implemented"});
  } 
});

regd_users.delete("/auth/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;
    const username = req.session.username;

    if (!username) {
        return res.status(401).json({ message: "You must be logged in to delete a review" });
    }

    // Check if the book with the given ISBN exists
    if (!books[isbn]) {
        return res.status(404).json({ message: "Book not found" });
    }

    // Check if the review by the logged-in user exists
    if (!books[isbn].reviews[username]) {
        return res.status(404).json({ message: "Review by this user not found" });
    }

    // Delete the review
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: "Review deleted successfully", reviews: books[isbn].reviews });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.username;
  // Check if the user is logged in
  if (!username) {
    return res.status(401).json({ message: "You must be logged in to submit a review" });
}

// Check if the book with the given ISBN exists
if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
}

// Add or modify the review
books[isbn].reviews = review;
return res.status(200).json({ message: "Review added/modified successfully", reviews: books[isbn].reviews });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
