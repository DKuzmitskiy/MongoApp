const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const oldApp = express();
const jsonParser = bodyParser.json();
const router = express.Router();

oldApp.use(express.static(__dirname + '/public'));

oldApp.use('/api', router);

router.get('/users', function (req, res) {
    let content = fs.readFileSync('users.json', 'utf8');
    let users = JSON.parse(content);
    res.send(users);
});

router.get('/users/:id', function (req, res) {
    let id = parseInt(req.params.id);
    let content = fs.readFileSync('users.json', 'utf8');
    let users = JSON.parse(content);
    let user = null;
    for (let i = 0; i < users.length; i++) {
        if (users[i].id === id) {
            user = users[i];
            break;
        }
    }
    if (user) {
        res.send(user);
    } else {
        res.status(400).send();
    }
});

router.post('/users', jsonParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);

    let userName = req.body.name;
    let userAge = req.body.age;
    let user = {name: userName, age: userAge};
    let data = fs.readFileSync('users.json', 'utf8');
    let users = JSON.parse(data);

    let id = Math.max.apply(Math, users.map(o => o.id));
    user.id = id+1;
    users.push(user);
    let dataToSAve = JSON.stringify(users);
    fs.writeFileSync('users.json', dataToSAve);
    res.send(user);
});

router.delete('/users/:id', function (req, res) {
    let id = parseInt(req.params.id);
    let data = fs.readFileSync('users.json', 'utf8');
    let users = JSON.parse(data);
    let index = -1;
    for (let i = 0; i < users.length; i++) {
        if (users[i].id === id) {
            index = i;
            break;
        }
    }
    if (index > -1) {
        let user = users.splice(index, 1)[0];
        let data = JSON.stringify(users);
        fs.writeFileSync('users.json', data);
        res.send(user);
    } else {
        res.sendStatus(400);
    }
});

router.put('/users/', jsonParser, function (req, res) {
    if (!req.body) return res.sendStatus(400);

    let userId = parseInt(req.body.id);
    let userName = req.body.name;
    let userAge = req.body.age;

    let data = fs.readFileSync("users.json", "utf8");
    let users = JSON.parse(data);
    let user;
    for(let i=0; i < users.length; i++){
        if(users[i].id === userId){
            user = users[i];
            break;
        }
    }

    if (user) {
        user.age = userAge;
        user.name = userName;
        let data = JSON.stringify(users);
        fs.writeFileSync('users.json', data);
        res.send(user);
    } else {
        res.sendStatus(400);
    }
});

oldApp.listen(3000, function () {
    console.log('Server started');
});

module.exports.app = oldApp;
