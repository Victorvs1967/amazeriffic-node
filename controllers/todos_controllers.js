const ToDo = require('../models/todo.js');

const ToDoController = {};

ToDoController.index = (req, res) => {
    ToDo.find({}, (err, toDos) => {
        res.json(toDos);
    });
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

module.exports = ToDoController;
