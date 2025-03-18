const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Check if a user with the given username already exists
const doesExist = (username) => {
    // Filter the users array for any user with the same username
    let userswithsamename = users.filter((user) => {
        return user.username === username;
    });
    // Return true if any user with the same username is found, otherwise false
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;

    // Check if both username and password are provided
    if (username && password) {
        // Check if the user does not already exist
        if (!doesExist(username)) {
            // Add the new user to the users array
            users.push({"username": username, "password": password});
            return res.status(200).json({message: "User successfully registered. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});
        }
    }
    // Return error if username or password is missing
    return res.status(404).json({message: "Unable to register user."});
  //return res.status(300).json({message: "Yet to be implemented"});
});


// Get the book list available in the shop
public_users.get('/',function (req, res) {
    //res.send(JSON.stringify({books},null,4));
    new Promise( (resolve, reject) => {
        try{
            const data = books;
            resolve(data)
        }catch(err){
            reject(err)
        }
    })
    .then(
            (data) => res.send(JSON.stringify({data},null,4)),
            (err) => res.send("Error loading the books")
    )
});  


// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    //const isbn = req.params.isbn;
    //res.send(books[isbn]);
    new Promise( (resolve, reject) => {
        try{
            const isbn = req.params.isbn;
            const data = books[isbn];
            resolve(data)
        }catch(err){
            reject(err)
        }
    })
    .then(
            (data) => res.send(JSON.stringify({data},null,4)),
            (err) => res.send("Error loading the books")
    )
    //return res.status(300).json({message: "Yet to be implemented"});
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    new Promise( (resolve, reject) => {
        try{
            let result = [];
            Object.keys(books).forEach(key => {
                if (books[key].author === req.params.author) {
                    result.push({id: key, ...books[key]});
                }
            });
            const data = result;
            resolve(data)
        }catch(err){
            reject(err)
        }
    })
    .then(
        (data) => res.send(JSON.stringify({data},null,4)),
        (err) => res.send("Error loading the books")
    )
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    new Promise( (resolve, reject) => {
        try{
            let result = [];
            Object.entries(books).forEach( ([key,book]) => {
                if (book.title.includes(req.params.title)){
                    result.push({id: key, ...books[key]})
                }
            });
            const data = result;
            resolve(data)
        }catch(err){
            reject(err)
        }
    })
    .then(
        (data) => res.send(JSON.stringify({data},null,4)),
        (err) => res.send("Error loading the books")
    )

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    res.send(books[isbn].reviews);
  //return res.status(300).json({message: "Yet to be implemented"});
});

module.exports.general = public_users;
