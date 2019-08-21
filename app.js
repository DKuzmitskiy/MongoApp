const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const objectId = require('mongodb').ObjectID;

const app = express();
const jsonParser = express.json();
const router = express.Router();

const mongoClient = new MongoClient('mongodb://localhost:27017/', {useNewUrlParser: true});

let dbClient;

app.use(express.static(__dirname + '/public'));
app.use('/api', router);

mongoClient.connect(function (err, client) {
    if (err) return console.log(err);
    dbClient = client;
    app.locals.collection = client.db('usersdb').collection('users');
    app.listen(3000, function () {
        console.log('Server started...')
    });
});

router.get('/users', function (req, res) {
    const collection = app.locals.collection;
    collection.find({}).toArray(function (err, users) {
        if (err) return console.log(err);
        res.send(users);
    })
});

router.get('/users/:id', function (req, res) {
    const id = new objectId(req.params.id);
    const collection = app.locals.collection;
    collection.findOne({_id: id}, function (err, user) {
        if (err) return console.log(err);
        res.send(user);
    })
});

router.post('/users', jsonParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);
    const userName = req.body.name;
    const userAge = req.body.age;
    const user = {name: userName, age: userAge};

    const collection = app.locals.collection;
    collection.insertOne(user, function (err, result) {
        console.log(result);
        if (err) return console.log(err);
        res.send(result.ops[0]);
    })
});

router.delete('/users/:id', function (req, res) {
    const id = new objectId(req.params.id);
    const collection = app.locals.collection;
    collection.findOneAndDelete({_id: id}, function (err, result) {
        console.log(result);
        if (err) return console.log(err);
        res.send(result.value);
    });
});

router.put('/users', jsonParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);
    const id = new objectId(req.body._id);
    const userName = req.body.name;
    const userAge = req.body.age;
    const collection = app.locals.collection;
    collection.findOneAndUpdate({_id: id}, {$set: {name: userName, age: userAge}},
        {returnOriginal: false}, function (err, result) {
            console.log(result);
            if (err) return console.log(err);
            res.send(result.value);
        });
});

router.get('/doggo', function (req, res) {
    let dog = {
        name: 'doggo',
        sayName() {
            console.log(this.name);
        }
    };
    dog.sayName();
    let sayName = dog.sayName;
    sayName();

    function Dog(name) {
        this.name = name
    }
    Dog.bark = function() {
        console.log(this.name + ' says woof')
    };
    Dog.bark();
    let fido = new Dog('fido');
    console.log(fido.name);
});

process.on('SIGINT', () => {
    dbClient.close();
    process.exit();
});
