/**
 * Created by chinghsu on 16/11/28.
 */
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/ethicall');

var todo = mongoose.model('Todo', {
    id: Number,
    title: String,
    completed: Boolean });

var todoEntity = new todo({
    id:4,
    title:'HHHH',
    completed: false });

todoEntity.save(function (err) {
    if (err) {
        console.log(err);
    } else {
        console.log('meow');
    }
});