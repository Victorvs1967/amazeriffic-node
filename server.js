const express = require('express'),
    http = require('http'),
    mongoose = require('mongoose'),
    ToDoController = require('./controllers/todos_controllers.js'),
    app = express();

app.use(express.static(__dirname + '/client'));
app.use(express.urlencoded({ extended: true}));

mongoose.connect('mongodb://localhost/amazeriffic', {useNewUrlParser: true, useUnifiedTopology: true});

http.createServer(app).listen(3000);

app.get('/todos.json', ToDoController.index);
app.get('/todos/:id', ToDoController.show);
app.post('/todos', ToDoController.create);