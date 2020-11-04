const express = require('express');
const axios = require('axios');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);

const app = express();
app.use(express.json());
const router = express.Router();

const userModel = require('./models/Users');
const storeModel = require('./models/Store');

const port = 8080;

//mongodb+srv://dbUser:<password>@cluster0.hp4lz.mongodb.net/<dbname>?retryWrites=true&w=majority
const url = 'mongodb+srv://dbUser:dbPassword@cluster0.hp4lz.mongodb.net/namazon?retryWrites=true&w=majority'



let database;

const config = {
    headers: {
        'X-Api-Key': '21a4eb73d3e946489014c280a9e583dc'
    }
}

const initDataBase = async () => {
    const database = await mongoose.connect(url,{useNewUrlParser: true, useUnifiedTopology: true});

    if (database){
        app.use(session({
            secret: 'IamASecret',
            store: new MongoStore({mongooseConnection: mongoose.connection})
        }));
        app.use(router);
        console.log("Successfully connected to my DB");
    } else {
        console.log("Error connecting to my DB");
    }
}

const initUsers = async () => {
    const Users = [];
    // Users.push({firstName:'Bob', lastName:'wajhdkla',email:'dfnakshf',cart:[]});
    // userModel.create(Users);
    //
    //Using axios to randomly initialize random first, last name, and email to populate the DB
    const firstNamesPromise = await axios.get('https://randommer.io/api/Name?nameType=firstname&quantity=10', config);
    const lastNamesPromise = await  axios.get('https://randommer.io/api/Name?nameType=surname&quantity=10',config);
    const emailPromise = await axios.get('https://randommer.io/api/Text/LoremIpsum?loremType=normal&type=words&number=10',config);

    // loops and populates the DB
    const result = await Promise.all([firstNamesPromise,lastNamesPromise,emailPromise]);
    result[0].data.forEach((name,index) => {
       Users.push({firstName: name, lastName: result[1].data[index],email: result[2].data[index], carts:[]});
    });

    await userModel.create(Users);
}
// manually hardcoded store items into the DB
const initStoreItems = async () => {
    const Items = [];
    Items.push({storeItem:'StarWars Mug',quantity:1});
    Items.push({storeItem:'Corsair Keyboard',quantity:7});
    Items.push({storeItem:'Mouse Pad',quantity:3});
    Items.push({storeItem:'Acer Monitor',quantity:54});
    Items.push({storeItem:'Hello World Mat',quantity:10});
    Items.push({storeItem:'Prisma Color pencils',quantity:56});
    Items.push({storeItem:'Black Spray Paint',quantity:7});
    Items.push({storeItem:'MacBook',quantity:99});
    Items.push({storeItem:'Dog Collar',quantity:13});
    Items.push({storeItem:'Topochico',quantity:24});
    Items.push({storeItem:'Beats headphones',quantity:69});


    storeModel.create(Items);
    // Tried using axios to fill the Store items in the DB but did not work, will retry later.
    // const cartItemName = await axios.get('https://randommer.io/api/Text/LoremIpsum?loremType=normal&type=words&number=50', config);
    //
    // for (let i = 0; i < cartItem.length; i++) {
    //     const assignedCart = Items[Math.floor(Math.random() * cartItem.length)];
    //     const newCart = {
    //         cartItem: cartItem[i]
    //     };
    //     const createdCart = await cartModel.create(newCart);
    //     assignedCart.carts.push(
    //         {
    //             cart: createdCart,
    //             quantity: Math.random()
    //         });
    //     await assignedCart.save();
    //
    // }
}
const populateDB = async () => {
    await initDataBase();
    await userModel.deleteMany({});
    await storeModel.deleteMany({});
    await initUsers();
    await initStoreItems();
}
populateDB();

router.get('/users', async (req,res) => {
    const foundUser = await userModel.find();
    res.send(foundUser ? foundUser : 404 );
});

router.get('/users/userId/:id', async (req,res)=>{
    const foundUser = await userModel.findById({_id: req.params.id});
    res.send(foundUser ? foundUser : 404);
});

// Creates a new user
router.post('/users', async (req,res) => {
    const newUser = await userModel.create(req.body);
    res.send(newUser ? newUser : 500);
});

// Gets the cart of a specific user by their id
router.get('/users/userId/:id/cart', async (req,res)=>{
    const foundUser = await userModel.findById({_id: req.params.id});

    res.send(foundUser.carts ? foundUser.carts : 404);
});

// Deletes a cart the users entire cart by their id
router.delete('/users/userId/:id/cart', async (req,res)=>{
    const foundUser = await userModel.findById({_id: req.params.id});
    foundUser.carts = [];
    res.send(foundUser.carts ? foundUser.carts : 404);
});

// Adds a new item to the users cart by the users cart id
router.post('/cart/cartId/:id/cartItem', async (req,res)=>{
    const foundUser = await userModel.findById({_id: req.params.id});
    const newItem = await storeModel.create(req.body);

    foundUser.carts.push(newItem);
    await foundUser.save();

    res.send(foundUser ? foundUser : 404);
});

// Deletes an item from a cart by the users cart id
router.delete('/cart/cartId/:id/cartItem/:cartItemId', async (req,res) =>{
    const foundUser = await userModel.findById({_id: req.params.id});
    const foundItem = await storeModel.findById({_id: req.params.cartItemId});

    foundUser.carts.splice(foundItem, 1);
    await foundUser.save();

    res.send(foundItem ? foundItem : 404);
});

// Gets the store item details
router.get('/storeItem/:id', async (req,res) =>{
    const foundStore  = await storeModel.findById({_id:req.params.id});
    if (!req.session.sessArray)
    {
        req.session.sessArray = [foundStore];
    }else{
        req.session.sessArray.push(foundStore);
    }

    res.send(foundStore ? foundStore : 404);
});

// Gets all items that satisfy a  regular expression query
router.get('/storeItem', async (req,res)=>{
    const foundStoreItem = await storeModel.find(
        {
            cartItem: new RegExp(req.query.cartItem),
            quantity: new RegExp(req.query.quantity)
        }
    )

    res.send(foundStoreItem ? foundStoreItem : 404);
});

router.get('/storeItemRecent', async(req,res) => {
    const lastViewed = [];
    let num = req.query.num;

    for (let i = 0; i < num; i++)
    {
        lastViewed.push(req.session.sessArray.pop());
    }

    res.send(lastViewed ? lastViewed : 404);
});


app.listen(port);
console.log(`listening on port ${port}`);

