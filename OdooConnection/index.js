/**
 * Created by chinghsu on 16/11/15.
 */
var Odoo = require('node-odoo');

var odoo = new Odoo({
    host: 'localhost',
    port: 48369,
    database: 'ethicall',
    username: 'admin',
    password: 'eth8911'
});

// Connect to Odoo
odoo.connect(function (err) {
    if (err) { return console.log(err); }

    // Get a partner
    odoo.get('ethicall.employee', 3, function (err, partner) {
        if (err) { return console.log(err); }

        console.log('Partner', partner);
    });
    // odoo.search('res.partner',[['login','','']],function(err,obj){
    //
    // });
});