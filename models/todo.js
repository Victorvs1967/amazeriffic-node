const mongoose = require('mongoose');

const ToDoSchema = mongoose.Schema({
    description: String,
    tags: [String]
});
const ToDo = mongoose.model('ToDo', ToDoSchema);

module.exports = ToDo;