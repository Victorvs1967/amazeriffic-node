const mongoose = require('mongoose'),
    User = require('../models/user.js'),
    UserController = {};

UserController.index = (req, res) => {
    console.log('Do index.');
    User.find({}, (err, result) => {
        console.log('Search users...');
        if (err !== null) {
            console.log('Error!');
            console.log(err);
        } else if (result.length === 0) {
            console.log('Create test user...');
            const testUser = new User({'username': 'Victor'});
            testUser.save((err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    console.log('Test user saved...');
                }
            });
        }
        console.log(result);
    });
    res.sendStatus(200);
};
UserController.show = (req, res) => {
    console.log('Do show.');
    User.find({'username': req.params.username}, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).send(err);
        } else if (result.length !== 0) {
            res.sendFile('index.html', {root: './client/'});
        } else {
            res.sendStatus(404);
        }
    });
};
UserController.create = (req, res) => {
    console.log('Do create.');
    res.sendStatus(200);
};
UserController.update = (req, res) => {
    console.log('Do update.');
    res.sendStatus(200);
};
UserController.destroy = (req, res) => {
    console.log('Do destroy.');
    res.sendStatus(200);
};

module.exports = UserController;
