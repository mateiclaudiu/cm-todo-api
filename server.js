var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');
var db = require('./db.js');

var app = express();
var PORT = process.env.PORT || 3000;
var todos = [];
var todoNextId = 1;

app.use(bodyParser.json()); // application-middleware, every time a json request comes in, it will be parsed to json

app.get('/', function(req, res) {
	res.send('Todo API Root');
});

// GET /todos?completed=true&q=work
app.get('/todos', function(req, res) {
	var query = req.query;
	var where = {};

	if (query.hasOwnProperty('completed') && query.completed === 'true') {
		where.completed = true;
	} else if (query.hasOwnProperty('completed') && query.completed === 'false') {
		where.completed = false;
	}

	if (query.hasOwnProperty('q') && query.q.length > 0) {
		where.description = {
			$like: '%' + query.q + '%'
		};
	}

	db.todo.findAll({
		where: where
	}).then(function(todos) {
		res.json(todos);
	}, function(err) {
		res.status(500).send();
	})
});

// GET /todos/:id
app.get('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10); // params.id is a string and id is a number


	db.todo.findById(todoId)
		.then(function(todo) {
			if (todo)
				res.json(todo.toJSON());
			else
				res.status(404).send();
		}, function(err) {
			res.status(400).json(err);
		});

});

// POST /todos
app.post('/todos', function(req, res) {
	var body = _.pick(req.body, 'description', 'completed'); //keep only the given values

	db.todo.create(body).then(function(todo) {
		res.json(todo.toJSON());
	}, function(err) {
		res.status(400).json(err);
	});
});


// DELETE /todos/:id
app.delete('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10); // params.id is a string and id is a number

	db.todo.destroy({
		where: {
			id: todoId
		}
	}).then(function(rowsDeleted) {
		console.log(typeof rowsDeleted);
		if (rowsDeleted === 0) {
			res.status(404).json({
				error: 'No todo with ' + todoId
			});
		} else {
			res.status(204).send();
		}
	}, function() {
		res.status(500).send();
	});



});


// PUT /todos/:id
app.put('/todos/:id', function(req, res) {
	var todoId = parseInt(req.params.id, 10); // params.id is a string and id is a number
	var body = _.pick(req.body, 'description', 'completed'); //keep only the given values
	/*var attributes = {};

	if (body.hasOwnProperty('completed')) {
		attributes.completed = body.completed;
	}


	if (body.hasOwnProperty('description')) {
		attributes.description = body.description;
	}*/

	db.todo.findById(todoId).then(function(todo) {
		if (todo) {
			return todo.update(body).then(function(todo) {
				res.json(todo.toJSON());
			}, function(err) {
				res.status(400).send(err);
			});
		} else {
			res.status(404).send();
		}
	}, function() {
		res.status(500).send();
	})
});

db.sequelize.sync({
	logging: console.log
}).then(function() {
	app.listen(PORT, function() {
		console.log('Express listening on port ' + PORT + '!');
	});
});