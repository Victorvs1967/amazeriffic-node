const mongoose = require('mongoose'),
    ObjectId = mongoose.Schema.Types.ObjectId,
    ToDoSchema = mongoose.Schema({
        description: String,
        tags: [String],
        owner: {type: ObjectId, ref: 'User'}
    });
   const ToDo = mongoose.model('ToDo', ToDoSchema);
   module.exports = ToDo;
