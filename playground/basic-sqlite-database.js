var Sequelize = require('sequelize');
var sequelize = new Sequelize(undefined, undefined, undefined, {
	dialect: 'sqlite',
	storage: __dirname + '/basic-sqlite-database.sqlite'
});

var Todo = sequelize.define('todo', {
	description: {
		type: Sequelize.STRING,
		allowNull: false,
		validate: {
			notEmpty: true,
			len: [1, 250]
		}
	},
	completed: {
		type: Sequelize.BOOLEAN,
		allowNull: false,
		defaultValue: false
	}
})

var User = sequelize.define('user', {
	email: Sequelize.STRING
});

Todo.belongsTo(User);
User.hasMany(Todo);

sequelize.sync({
	//force: true,
	logging: console.log
}).then(function() {
	console.log('Everything is synced');

	/*User.create({
		email : 'claudiu@gmail.com'
	}).then(function(){
		return Todo.create({
			description:'clean yeard'
		});
	}).then(function(todo){
		User.findById(1).then(function(user){
			user.addTodo(todo);
		});
	});*/

	User.findById(2).then(function(user) {
		user.getTodos().then(function(todos) {
			todos.forEach(function(todo) {
				console.log(todo.toJSON())
			})
		});
	});

})