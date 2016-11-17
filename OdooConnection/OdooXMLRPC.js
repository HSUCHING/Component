/**
 * Created by chinghsu on 16/11/15.
 */
var Odoo = require('odoo-xmlrpc');
var odoo = new Odoo({
    url: 'localhost',
    port: 48369,
    db: 'ethicall',
    username: 'admin',
    password: 'eth8911'
});
odoo.connect(function (err) {
    if (err) { return console.log(err); }
    console.log('Connected to Odoo server.');
});

odoo.connect(function (err) {
    if (err) { return console.log(err); }
    console.log('Connected to Odoo server.');
    var inParams = [];
    inParams.push('read');
    inParams.push(false); //raise_exception
    var params = [];
    params.push(inParams);
    odoo.execute_kw('res.partner', 'check_access_rights', params, function (err, value) {
        if (err) { return console.log(err); }
        console.log('Result: ', value);
    });
});

odoo.connect(function (err) {
    if (err) { return console.log(err); }
    console.log('Connected to Odoo server.');
    var inParams = [];
    inParams.push([['is_company', '=', true],['customer', '=', true]]);
    var params = [];
    params.push(inParams);
    odoo.execute_kw('res.partner', 'search', params, function (err, value) {
        if (err) { return console.log(err); }
        console.log('Result: ', value);
    });
});
