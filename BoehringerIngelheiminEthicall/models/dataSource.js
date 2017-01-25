/**
 * Created by chinghsu on 16/12/1.
 */
var mongoose = require("mongoose");	//	顶会议用户组件
var Schema = mongoose.Schema;	//	创建模型
var setting = require('../setting');
var periodSchema = new Schema({
    messenger_name: String,
    doctor_name: String,
    visit_time: String,
    doctor_department: String,
    read_article: String,
    dsm_name: String,
    read_article_state: Boolean,
    evaluate_doctor: String,
    finish_visit: Boolean,
    doctor_title: String,
    doctor_hospital: String,
    finish_visit: String,
    messenger_department: String,
    product_name: Array
});
var conferenceSchema = new Schema({
    meeting_type: String,
    questionnaire_num: {type: Number, default: 0},
    start_time: Date,
    attend_numbers: {type: Number, default: 0},
    meeting_directer: String,
    attend_messengers: Array,
    meeting_state: String,
    meeting_speaker: String,
    end_time: Date,
    meeting_name: String,
    siginin_num: {type: Number, default: 0}
});

var agencySchema = new Schema({
    name: String,
    mobile: String,
    dsmName: String,
    dsmMobile: String,
    department: String
});


var DataSource = function () {
    var sourceStrategy = {
        //regular Publication
        periodPub: function (res, id, config) {
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

                var db = mongoose.connect(setting.mongodb + setting.biDB);
                var periodModel = db.model('period_result', periodSchema);
                periodModel.find(function (err, results) {
                    if (err) return console.error(err);
                    var result = {
                        msg: "success",
                        data: {
                            period: result.slice(0, result.length - 1),
                            periodTitle: result.slice(result.length - 1)
                        }
                    };
                    res.json(result);
                    mongoose.disconnect();
                });

            }
        },


        //conference Progress
        confProgress: function (res, id, config) {
            var db = mongoose.connect(setting.mongodb + setting.biDB);
            var conferenceModel = db.model('conference_result', conferenceSchema);
            conferenceModel.find(function (err, results) {
                if (err) return console.error(err);
                var result = {
                    msg: "success",
                    data: results
                };
                res.json(result);
                mongoose.disconnect();
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

                var db = mongoose.connect(setting.mongodb + setting.biDB);
                var agencyModel = db.model('agencyinfo_result', agencySchema);
                agencyModel.find(function (err, results) {
                    if (err) return console.error(err);
                    var result = {
                        msg: "success",
                        data: results
                    };
                    res.json(result);
                    mongoose.disconnect();
                });
            }
        }

    };
    return function (type, param) {
        return sourceStrategy[type] && sourceStrategy[type].apply(this, param);
    }
}();

module.exports = DataSource;