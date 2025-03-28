const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ //returns boolean
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password);
    });
    // Return true if any valid user is found, otherwise false
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

//only registered users can login
regd_users.post("/login", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if username or password is missing
    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    // Authenticate user
    if (authenticatedUser(username, password)) {
        // Generate JWT access token
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60*60 });

        // Store access token and username in session
        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    let book = books[isbn]
    if (book) {
        let username  = req.session.authorization.username;
        let review = req.body.review;
        book.reviews[username] = review;

        res.send(`Book of isbn ${isbn} review updated`)
    }
    else {
        res.send("Unable to find book")
    }
});

//delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {

    const isbn = req.params.isbn;
    if (isbn) {
        let book = books[isbn];
        if (book) {
            let username  = req.session.authorization.username;
            if (book.reviews[username]){
                delete book.reviews[username];
            }     
            res.send(`Book of isbn ${isbn} review deleted`)
        }
        else {
            res.send("Unable to find book")
        }
    }
    
    res.send(`can not delete review for book of isbn ${isbn} .`);
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
