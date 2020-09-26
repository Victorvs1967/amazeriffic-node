const express = require('express'),
    http = require('http'),
    mongoose = require('mongoose'),
    app = express();

app.use(express.static(__dirname + '/client'));
app.use(express.urlencoded({ extended: true}));
mongoose.connect('mongodb://localhost/amazeriffic', {useNewUrlParser: true, useUnifiedTopology: true});

const ToDoSchema = mongoose.Schema({
    description: String,
    tags: [String]
});
const ToDo = mongoose.model('ToDo', ToDoSchema);

http.createServer(app).listen(3000);

app.get('/todo.json', (req, res) => {
    ToDo.find({}, (err, toDos) => {
        if (err !== null) {
            console.log(err);
        }
        res.json(toDos);
    });
});
app.post('/todos', (req, res) => {
    console.log(req.body);
    const newToDo = new ToDo({'description': req.body.description, 'tags': req.body.tags});
    newToDo.save((err, result) => {
        if (err !== null) {
            console.log(err);
            res.send('ERROR');
        } else {
            ToDo.find({}, (err, result) => {
                if (err !== null) {
                    res.send('ERROR');
                }
                res.json(result);
            });
        }
    });
});