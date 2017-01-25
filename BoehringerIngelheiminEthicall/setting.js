/**
 * Created by chinghsu on 16/11/17.
 */
var setting = {
    cookieSecret: "EthicallBI",
    defaultName: "BIEthicall",
    defaultPsw: "BI123456",
    db: "ethicall",
    mongodb: "mongodb://localhost/",
    odooPort: "48369",
    odooDB: "ethicall",
    biDB: "EthicallBIDB",
    // odooUsername: 'admin',
    odooUsername: 'information@ethicall.cn',
    odooPassword: '&iE#nG@3Qm5A@@5N',
    // odooPassword: 'eth8911',
    company: {
        "1001": '勃林格殷格翰'
    },
    behaviorTypeMap: {
        "visitDoctor": "visit_doctor",
        "doctorSubscribe": "wechat_doctor_subscribe",
        "readArticle": "doctor_view_wechat_product_article",
        "doctorComment": "doctor_evaluate_messenger",
        "visited": "visit_doctor_task_package"
    }
};
module.exports = setting;