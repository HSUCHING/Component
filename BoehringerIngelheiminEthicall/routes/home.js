/**
 * Created by chinghsu on 16/11/20.
 */
var express = require('express');
var homeRouter = express.Router();
var dataSource = require('../models/dataSource');


homeRouter.use('/', function (req, res, next) {
    next();
});

homeRouter.route('/').get(function(req, res, next){
    res.render('home.ejs', {name: req.session.username});
});

// homeRouter.param("companyID",function(req,res,next,id){
//     next();
// });


homeRouter.route('/:source/:companyID/:type').get(function (req, res, next) {
    var config = req.body.config||{
            type:req.params.type
        };
    dataSource(req.params.source,[res, req.params.companyID, config]);
    // res.send(200);
});

module.exports = homeRouter;
