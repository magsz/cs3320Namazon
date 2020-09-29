const express = require('express');

const app = express();

let users = [];
let userNextId = 0;

let cart = [];
let cartNextId = 0;

let store = [];
let storeNextId = 0;

const userData = {
    id:userNextId++,
    "firstName":"Mario",
    "lastName":"Gomez",
    "email":"email@email.com",
    cart:[]
};

const userData2 = {
    id:userNextId++,
    "firstname":"bob",
    "lastName":"lopez",
    "email":"email2@email.com",
    cart2:[]
};

const cartItem = {
    id:cartNextId++,
    "item":"cartItem",
    "quantity":"quantity"
};

const storeItem = {
    id:storeNextId++,
    "item":"storeItem"
};

users.push(userData);
userData.cart.push(cartItem);
users.push(userData2);
userData2.cart2.push(cartItem);
store.push(storeItem);

// Creates a new user
app.post('/users', (req,res) => {
  let newUser = req.body;
  newUser.id = userNextId++;
  users.push(newUser);
  res.send(newUser);
});

// Gets all the users
app.get('/users', (req,res) => {
    res.send(users);
})
// Gets the user by their user ID
app.get('/users/:userId', (req,res) =>
{
    const foundUser = users.find((user) => {
        return user.id === req.params.id
    })
    res.send(foundUser);
});

app.listen('8080');