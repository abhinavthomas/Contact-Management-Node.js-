var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var ContactSchema = new Schema({
	firstName:{type: String, default:''},
	lastName:{type: String, default:''},
	middleName:{type: String, default:''},
	email:{type: String, default:''},
	mobile:{type: String, default:''},
	deleted:{type:Boolean, default: false}
});
mongoose.model('Contact',ContactSchema);
