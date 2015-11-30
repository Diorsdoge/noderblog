var mongoose = require('mongoose');
var settings = require('../config');

mongoose.connect('mongodb://localhost/noderblog');
var Schema = mongoose.Schema;

require('./user');
require('./post');
require('./comments');

exports.User = mongoose.model('User');
exports.Post = mongoose.model('Post');
exports.Comments = mongoose.model('Comments');