/**
 * Created by chinghsu on 16/11/18.
 */
var Odoo = require('odoo');
var setting = require('../setting');
var odoo = new Odoo({
    host: 'localhost',
    port: setting.odooPort,
    database: setting.odooDB,
    username: setting.odooUsername,
    password: setting.odooPassword
});


var DataSource = function () {
    var sourceStrategy = {
        //regular Publication
        regularPub: function (res, id, config) {
            if (!id || !config || !config.type) {
                var error = {
                    msg: "参数缺失",
                    data: []
                };
                res.send(error);
            } else {
                var config = {
                    behaviorType: setting["behaviorTypeMap"][config.type],
                    startTime: new Date(config.startTime || "1800-01-01"),
                    endTime: new Date(config.endTime || "3000-12-31")
                };

                odoo.connect(function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    var paramsVC = {
                        domain: [['name', '=', setting.company[id]]],
                        limit: 10000
                    };
                    odoo.search_read('res.virtual.country', paramsVC, function (err, obj) {
                        if (err) {
                            return console.log(err);
                        }
                        var resident_ids = [];
                        for (var i = 0; i < obj.length; i++) {
                            resident_ids = resident_ids.concat(obj[i].resident_ids);
                        }
                        var paramsMS = {
                            domain: [['resident_id', 'in', resident_ids]],
                            limit: 10000
                        };
                        odoo.search_read('ethicall.messenger', paramsMS, function (err, obj) {
                            var messenger_ids = [];
                            if (err) {
                                return console.log(err);
                            }
                            for (var i = 0; i < obj.length; i++) {
                                messenger_ids.push(obj[i].id);
                            }
                            var startTime = new Date(config.startTime), endTime = new Date(config.endTime);
                            var record = {};
                            record.data = [];
                            var paramsRD = {
                                fields: ['id', 'target', 'source', 'source_name', 'target_name'],
                                domain: [['category_value', '=', config.behaviorType], ['category', '=', 'dictionary.er.base.interactive'], ['create_time', '<', endTime], ['create_time', '>', startTime]],
                                limit: 100
                            };
                            console.log(messenger_ids);
                            odoo.search_read('er.base.behavior.record', paramsRD, function (err, obj) {
                                var source_ids = [];
                                var target_ids = [];
                                var _obj = obj.filter(function (record) {
                                    // var recordArr = ([] && record.source && record.source.split(","));
                                    var recordArr = record.source.split(",");
                                    if (recordArr[0] == 'ethicall.messenger' && (messenger_ids.indexOf(parseInt(recordArr[1])) != -1)) {
                                        recordArr[1] && source_ids.push(recordArr[1]);
                                        record.target.split(",")[1] && target_ids.push(record.target.split(",")[1]);
                                        return true;
                                    } else {
                                        return false;
                                    }
                                });

                                console.log(_obj);
                                var paramsMesg = {
                                    fields: ['id', 'name', ''],
                                    domain: [['id', 'in', source_ids]],
                                    limit: 10
                                };

                                odoo.search_read('ethicall.messenger', paramsMesg, function (err, _msobj) {
                                    console.log(_msobj);
                                });


                                // record.msg = "Success";
                                // record.data = obj;
                                // console.log(record.data);
                                res.send(200);
                            });
                        })
                    });
                });
            }
        },

        //     record.data.push({
        //         //姓名:
        //         messenger_name: obj.source_name,
        //         //所属公司:
        //         messenger_department: obj.source_name,
        //         //DSM:
        //         dsm_name: "",
        //         //产品:
        //         product_name: "",
        //         //医生:
        //         doctor: obj.target_name,
        //         //医生级别:
        //         doctor_title: "",
        //         //所属医院:
        //         doctor_hospital: "",
        //         //科室:
        //         doctor_department: "",
        //         //文献名:
        //         read_article: "",
        //         //阅读状态:
        //         read_article_state: "",
        //         //评价医生
        //         evaluate_doctor: ""
        //
        //     });


        //conference Progress
        confProgress: function (res, id, config) {
            odoo.connect(function (err) {
                if (err) {
                    return console.log(err);
                }
                var paramsMT = {
                    domain: [],
                    limit: 1000
                };
                var conferenceResult = {};
                odoo.search_read('ethicall.meeting', paramsMT, function (err, mtObj) {
                    var paramsMTIR = {
                        domain: [['ethicall_meeting_id', 'in', mtObj.map(function (o) {
                            return o.meeting_id[0];
                        })]],
                        limit: 1000
                    };
                    var paramsMTI = {
                        // domain: [['ethicall_meeting_id', 'in', mtObj.map(function (o) {
                        //     return o.meeting_id[0];
                        // })]],
                        domain:[['identity','=', 'ethicall.messenger,'+29164]],
                        limit: 2
                    };

                    odoo.search_read('res.virtual.country.resident.identity.line', paramsMTI, function (err, obj) {
                        console.log(obj);
                        odoo.search_read('ethicall.meeting.indiv.record', paramsMTIR, function (err, obj) {
                            conferenceResult.msg = "Success";
                            conferenceResult.data = [];
                            for (var index = 0; index < mtObj.length; index++) {
                                var signNum = 0;
                                var questionnaireNum = 0;
                                for (var i = 0; i < obj.length; i++) {
                                    if ((obj[i].ethicall_meeting_id[0] == mtObj[index].meeting_id[0]) && (obj[i].behavior_type[1] == '会议签到')) {
                                        signNum++;
                                    }
                                    if ((obj[i].ethicall_meeting_id[0] == mtObj[index].meeting_id[0]) && (obj[i].behavior_type[1] == '会议问卷提交')) {
                                        questionnaireNum++;
                                    }
                                }
                                conferenceResult.data.push({
                                    //会议主题
                                    topic: mtObj[index].name,
                                    //类型
                                    type: mtObj[index].type[1],
                                    //与会人数
                                    attendNum: mtObj[index].eth_indiv_meetings.length,
                                    //状态
                                    status: mtObj[index].state,
                                    //主讲人
                                    speaker: mtObj[index].speaker,
                                    //主持人
                                    director: mtObj[index].speaker,
                                    //签到人数
                                    signNum: signNum,
                                    //问卷人数
                                    questionnaireNum: questionnaireNum,
                                    //开始时间
                                    startTime: mtObj[index].time_start,
                                    //结束时间
                                    endTime: mtObj[index].time_deadline
                                    //主持人
                                });
                            }
                            res.send(conferenceResult);
                        });
                    });

                });
            });

        },

        //agency Information
        agencyInfo: function (res, id, config) {
            if (!id || !config || !config.type) {
                var error = {
                    msg: "参数缺失",
                    data: []
                };
                res.send(error);
            } else {
                var config = {
                    behaviorType: setting["behaviorTypeMap"][config.type],
                    startTime: new Date(config.startTime || "1800-01-01"),
                    endTime: new Date(config.endTime || "3000-12-31")
                };

                odoo.connect(function (err) {
                    if (err) {
                        return console.log(err);
                    }
                    var paramsVC = {
                        domain: [['name', '=', setting.company[id]]],
                        limit: 10000
                    };
                    var country_id;
                    odoo.search_read('res.virtual.country', paramsVC, function (err, obj) {
                        if (err) {
                            return console.log(err);
                        }
                        var department_ids = [];
                        for (var i = 0; i < obj.length; i++) {
                            department_ids = department_ids.concat(obj[i].department_ids);
                            country_id = obj[i].id;
                        }
                        var paramsVCD = {
                            domain: [['id', 'in', department_ids]],
                            limit: 10000
                        };
                        odoo.search_read('res.virtual.country.department', paramsVCD, function (err, obj) {
                            if (err) {
                                return console.log(err);
                            }
                            var resident_ids = [];
                            for (var i = 0; i < obj.length; i++) {
                                resident_ids = resident_ids.concat(obj[i].residents);
                            }

                            var paramsVCR = {
                                domain: [['id', 'in', resident_ids]],
                                limit: 10000
                            };
                            odoo.search_read('res.virtual.country.resident', paramsVCR, function (err, obj) {
                                if (err) {
                                    return console.log(err);
                                }
                                console.log(obj);
                                var director_ids = [];
                                for (var i = 0; i < obj.length; i++) {
                                    obj[i].direct_officer_id && (director_ids.push(obj[i].direct_officer_id[0]));
                                }

                                var paramsVCRD = {
                                    fields: ['id', 'mobile'],
                                    domain: [['id', 'in', director_ids]],
                                    limit: 10000
                                };
                                odoo.search_read('res.virtual.country.resident', paramsVCRD, function (err, directObj) {
                                    var resident = [];
                                    for (var index = 0; index < obj.length; index++) {
                                        var dsmMobile = directObj.filter(function (_obj) {
                                            return obj[index].direct_officer_id && (obj[index].direct_officer_id[0] == _obj.id);
                                        });
                                        resident.push({
                                            name: obj[index].name,
                                            mobile: obj[index].mobile,
                                            company: obj[index].department_id[1],
                                            dsmName: (obj[index].direct_officer_id && obj[index].direct_officer_id[1]) || "",
                                            dsmMobile: (dsmMobile.length > 0) ? dsmMobile[0].mobile : ""
                                        });
                                    }
                                    var record = {
                                        msg: "Success",
                                        data: resident
                                    };
                                    res.send(record);
                                })
                            });
                        })
                    });
                });
            }
        }

    };
    return function (type, param) {
        return sourceStrategy[type] && sourceStrategy[type].apply(this, param);
    }
}();

module.exports = DataSource;


