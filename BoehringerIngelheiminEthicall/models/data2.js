/**
 * Created by chinghsu on 16/11/18.
 */
var Odoo = require('odoo-connect');
var setting = require('../setting');
var odoo = new Odoo({
    host: 'localhost',
    port: setting.odooPort
});
var connect = odoo.connect({
    database: setting.odooDB,
    username: setting.odooUsername,
    password: setting.odooPassword
});
var config = {
    behaviorType: setting["behaviorTypeMap"]["visitDoctor"],
    startTime: new Date("1800-01-01"),
    endTime: new Date("3000-12-31")
};
var vc, vb, mids;
connect.then(client => {
    var paramsVC = {
        domain: [['name', '=', setting.company["1001"]]]
    };
    return client.searchRead('res.virtual.country', paramsVC.domain);
}).then(vcObj=> {
    vc = vcObj;
    return connect;
}).then(client => {
    var resident_ids = [];
    for (var i = 0; i < vc.length; i++) {
        resident_ids.push(vc[i][0]);
    }
    var paramsMS = {
        domain: [['resident_id', 'in', resident_ids]]
    };
    return client.searchRead('ethicall.messenger', paramsMS.domain);
}).then(vbObj=> {
    vb = vbObj;
    return connect;
}).then(client => {
    var messenger_ids = [];
    for (var i = 0; i < vb.length; i++) {
        messenger_ids.push(vb[i].id);
    }
    var startTime = new Date(config.startTime), endTime = new Date(config.endTime);
    var paramsRD = {
        fields: ['id', 'source'],
        domain: [['category_value', '=', config.behaviorType], ['category', '=', 'dictionary.er.base.interactive'], ['create_time', '<', endTime], ['create_time', '>', startTime]],
    };
    mids = messenger_ids;
    return client.searchRead('er.base.behavior.record', paramsRD.domain,{limit:10000});
}).then(result => {
    var record = {};
    result.filter(function (record) {
        var recordArr = ([] && record.source && record.source.split(","));
        if (recordArr[0] == 'ethicall.messenger' && (mids.indexOf(recordArr[1]) != -1)) {
            return true;
        } else {
            return false;
        }
    });
    record.msg = "Success";
    record.data = result;
    console.log(record.data.length);
    console.log(record);
});



