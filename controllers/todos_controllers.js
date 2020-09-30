const mongoose = require('mongoose'),
    ToDo = require('../models/todo.js'),
    User = require('../models/user.js'),
    ToDoController = {};

ToDoController.index = (req, res) => {
    const username = req.params.username || null;
    const respondWithToDos = (query) => {
        ToDo.find(query, (err, toDos) => {
            if (err !== null) {
                res.status(500).json(err);
            } else {
                res.status(200).json(toDos);
            }
        });
    };
    if (username !== null) {
        User.find({'username': username}, (err, result) => {
            if (err !== null) {
                res.status(500).json(err);
            } else if (result.length === 0) {
                res.sendStatus(404);
            } else {
                respondWithToDos({'owner': result[0].id});
            }
        });
    } else {
        respondWithToDos({});
    }
};

ToDoController.create = (req, res) => {
    const newToDo = new ToDo({'description': req.body.description, 'tags': req.body.tags});
    newToDo.save((err, result) => {
        console.log(result);
        if (err !== null) {
            console.log(err);
            res.status(500).json(err);
        } else {
            res.status(200).json(result);
        }
    });
};
ToDoController.show = (req, res) => {
    ToDo.findById(req.params.id, (err, todo) => {
        if (err !== null) {
            console.log('Error: ' + err);
            res.status(500).json(err);
        } else {
            if (todo === null) {
                res.sendStatus(404);
            } else {
                res.status(200).json(todo);
            }
        }
    });
};
ToDoController.update = (req, res) => {
    console.log('Todo update');
    res.sendStatus(200);
};
ToDoController.destroy = (req, res) => {
    console.log('Todo destroy');
    res.sendStatus(200);
};

module.exports = ToDoController;
