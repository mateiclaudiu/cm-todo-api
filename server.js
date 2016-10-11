var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore'); 

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId=1;

app.use(bodyParser.json()); // application-middleware, every time a json request comes in, it will be parsed to json

app.get('/', function (req, res) {
	res.send('Todo API Root');
});

// GET /todos
app.get('/todos', function (req, res) {
	res.json(todos);
});

// GET /todos/:id
app.get('/todos/:id', function(req,res){
	var todoId = parseInt(req.params.id, 10); // params.id is a string and id is a number
	var matchedTodo = _.findWhere(todos, {id:todoId});

	/*var matchedTodo;

	todos.forEach(function(todo){
		if(todo.id === todoId){
			matchedTodo=todo;

		}
	});*/


	if(matchedTodo){
		res.json(matchedTodo);
	}else{
		res.status(404).send('Todo with id '+todoId+' not found!');
	}

});

// POST /todos
app.post('/todos', function (req, res){
	var body = _.pick(req.body, 'description','completed');//keep only the given values

	if(!_.isBoolean(body.completed || !_.isString(body.description)) || body.description.trim().length === 0){
		return res.status(400).send();
	}

	body.description=body.description.trim();
	body.id=todoNextId++;

	todos.push(body);

	res.json(body);
});


app.listen(PORT, function () {
	console.log('Express listening on port ' + PORT + '!');
});