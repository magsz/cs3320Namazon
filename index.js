const express = require('express');

const app = express();

app.use(express.json());

let users = [];
let userNextId = 0;
let cartNextId = 0;
let itemId = 0;
let quantity = 1;

let store = [];
let storeNextId = 0;

const userData = {
    id:userNextId,
    "firstName":"Mario",
    "lastName":"Gomez",
    "email":"email@email.com",
    carts:[]
};

const userData2 = {
    id:userNextId++,
    "firstname":"bob",
    "lastName":"lopez",
    "email":"email2@email.com",
    carts:[]
};

const userData3 = {
    id:userNextId++,
    "firstName":"Jason",
    "lastName":"Diaz",
    "email":"jdiaz@email.com",
    carts:[]
};

const cartItem = {
    id:cartNextId++,
    "cartItemId":itemId++,
    "item":"Coffee Cup",
    quantity:quantity
};

const storeItem = {
    id:storeNextId++,
    "item":"Coffee Cup",
    quantity:quantity
};

users.push(userData);
userData.carts.push(cartItem);
users.push(userData2);
userData2.carts.push(cartItem);
store.push(storeItem);

// Gets all the users
app.get('/users', (req,res) => {
    res.send(users);
})

// Gets the user by their user ID
app.get('/users/userId/:id', (req,res)=>{
    const foundUser = users.find((user)=>{
        return user.id == req.params.id
    })
    res.send(foundUser || 404);
})

// Creates a new user
app.post('/users', (req,res) => {
  let newUser = req.body;
  newUser.id = userNextId++;
  newUser.firstName = req.param("Peter");
  newUser.lastName = req.param("Griffen");
  users.push(newUser);
  res.send(newUser);
});

// Gets the cart of a specific user by their id
app.get('/users/userId/:id/cart', (req,res)=>{
    let foundCart = userData.carts.find(cart=>
        cart.id === (parseInt(req.params.id)));
    let foundCartIndex = userData.carts.indexOf(foundCart);

    res.send(foundCart || 404);
});

// Deletes a cart the users entire cart by their id
app.delete('/users/userId/:id/cart', (req,res)=>{
    let foundCart = userData.carts.find(cart=>
    cart.id === (parseInt(req.params.id)));
    let foundCartIndex = userData.carts.indexOf(foundCart);
    // Deletes the cart by the index
    users.splice(foundCartIndex,1);
    //returns the cart that was deleted
    res.send(foundCart || 404);
});

// Adds a new item to the users cart by the users cart id
app.post('/cart/cartId/:id/cartItem', (req,res)=>{
    let newCartItem = req.body;
    newCartItem.id = itemId++;
    newCartItem.item = req.param("Star Wars Coffee mug");
    newCartItem.quantity = quantity++;
    userData.carts.push(newCartItem);

   res.send(newCartItem || 404);
});

// Deletes an item from a cart by the users cart id
app.delete('/cart/cartId/:id/cartItem/:cartItemId', (req,res) =>{
  let foundCart = userData.carts.find(cartItem =>
  cartItem.id === parseInt(req.params.cartItemId));

  if(!foundCart) res.status(404).send("The cart Item was not found");
  let foundCartItemIndex = userData.carts.indexOf(foundCart);

  users.splice(foundCartItemIndex);

  res.send(foundCart);
});

// Gets the store item details
app.get('/storeItem/:id', (req,res) =>{
   const foundStore = store.find(store => {
       return store.id == req.params.id;
   })

    res.send(foundStore || 404);
});

// Gets all items that satisfy a  regular expression query
app.get('/storeItem', (req,res)=>{
    res.send(store.filter((item)=>{
        return item.item === req.query.item;
    }));
});

app.listen('8080');