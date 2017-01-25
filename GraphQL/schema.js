/**
 * Created by chinghsu on 16/11/28.
 */
var graphql = require('graphql');
var mongoose = require('mongoose');
mongoose.connect("mongodb://localhost/ethicall");
var TODO = mongoose.model('Todo', {
    id: mongoose.Schema.Types.ObjectId,
    title: String,
    completed: Boolean
});

// var userModel = db.model('user', userSchema);
// var userEntity = new userModel(this);
// userEntity.save(function (err) {
//     if (err) throw err;
//     console.log("Task saved");
//     fn(err);
//     mongoose.disconnect();
// });

var count = 0;
var TODOs = [
    {
        "id": 1446412739542,
        "title": "Read emails",
        "completed": false
    },
    {
        "id": 1446412740883,
        "title": "Buy orange",
        "completed": true
    }
];

var TodoType = new graphql.GraphQLObjectType({
    name: 'todo',
    fields: function () {
        return {
            id: {
                type: graphql.GraphQLID
            },
            title: {
                type: graphql.GraphQLString
            },
            completed: {
                type: graphql.GraphQLBoolean
            }
        }
    }
});

var MutationAdd = {
    type: TodoType,
    description: 'Add a Todo',
    args: {
        title: {
            name: 'Todo title',
            type: new graphql.GraphQLNonNull(graphql.GraphQLString)
        }
    },
    resolve: (root, args)=> {
        var newTodo = new TODO({
            title: args.title,
            completed: false
        });
        newTodo.id = newTodo._id;
        return new Promise((resolve, reject) => {
            newTodo.save(function (err) {
                if (err) reject(err)
                else resolve(newTodo)
            })
        })
    }
};

var queryType = new graphql.GraphQLObjectType({
    name: 'Query',
    fields: function () {
        return {
            todos: {
                type: new graphql.GraphQLList(TodoType),
                resolve: function () {
                    return new Promise(function (resolve, reject) {
                        setTimeout(function () {
                            resolve(TODOs);
                        }, 1000);
                    });
                }
            }
        }
    }
});
var queryType2 = new graphql.GraphQLObjectType({
    name: 'Query',
    fields: () => ({
        todos: {
            type: new graphql.GraphQLList(TodoType),
            resolve: () => {
                return new Promise((resolve, reject) => {
                    TODO.find((err, todos) => {
                        if (err) reject(err)
                        else resolve(todos)
                    })
                })
            }
        }
    })
});

var updateCount={
    type: graphql.GraphQLInt,
    description: 'Update the count',
    resolve: function() {
        count += 1;
        return count;
    }
};
var MutationType = new graphql.GraphQLObjectType({
    name: 'Mutation',
    // fields: {
    //     // update: updateCount
    //     add:MutationAdd
    // }
    fields:function(){
        return {
            add:{
                type: TodoType,
                description: 'Add a Todo',
                args: {
                    title: {
                        name: 'Todo title',
                        type: new graphql.GraphQLNonNull(graphql.GraphQLString)
                    }
                },
                resolve: (root, args)=> {
                    var newTodo = new TODO({
                        title: args.title,
                        completed: false
                    });
                    newTodo.id = newTodo._id;
                    return new Promise((resolve, reject) => {
                        newTodo.save(function (err) {
                            if (err) reject(err)
                            else resolve(newTodo)
                        })
                    })
                }
            }
        }
    }
});

module.exports = new graphql.GraphQLSchema({
    // query: queryType2,
    query:queryType,
    mutation: MutationType
});