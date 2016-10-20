var _ = require('underscore');


module.exports = function(sequelize, DataTypes) {
	return sequelize.define('todo', {
		description: {
			type: DataTypes.STRING,
			allowNull: false,
			validate: {
				notEmpty: true,
				len: [1, 250],
				descriptionIsString: function() {
					console.log('THIS: ' + JSON.stringify(this));
					if (!_.isString(this.description)) {
						throw new Error(this.get('description') + 'Description must be string.')
					}
				}
			}
		},
		completed: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: false
		}
	});
};