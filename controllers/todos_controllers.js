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
ToDoController.show = (req, res) => {
    const id = req.params.id;
    ToDo.find({'_id':id}, (err, todo) => {
        if (err !== null) {
            res.json(err);
        } else {
            if (todo.length > 0) {
                res.json(todo[0]);
            } else {
                res.send('Not found');
            }
        }
    });
};

module.exports = ToDoController;
