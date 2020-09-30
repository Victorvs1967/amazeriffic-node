const express = require('express'),
    http = require('http'),
    mongoose = require('mongoose'),
    ToDoController = require('./controllers/todos_controllers.js'),
    UserController = require('./controllers/users_controllers.js'),
    app = express();

app.use(express.static(__dirname + '/client'));
app.use(express.urlencoded({ extended: true}));

mongoose.connect('mongodb://localhost/amazeriffic', {useMongoClient: true});

http.createServer(app).listen(3000);

app.get('/todos.json', ToDoController.index);
app.get('/todos/:id', ToDoController.show);
app.post('/todos', ToDoController.create);

app.get('/users.json', UserController.index);
app.post('/users', UserController.create);
app.get('/users/:username', UserController.show);
app.put('/users/:username', UserController.update);
app.delete('/users/:username', UserController.destroy);

app.get('/users/:username/todos.json', ToDoController.index);
app.post('/users/:username/todos', ToDoController.create);
app.put('/users/:username/todos/:id', ToDoController.update);
app.delete('/users/:username/todos/:id', ToDoController.destroy);