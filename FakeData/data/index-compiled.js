var faker = require('Faker');
var fs = require("fs");
var dataFormat = require("./data.json");

faker.locale = "zh_CN";

var dataStrategy = function () {
    var strategy = {
        address: function (value) {
            return value || faker.address.street();
        },
        city: function (value) {
            return value || faker.address.city();
        },
        country: function (value) {
            return value || faker.address.country();
        },
        latitude: function (value) {
            return value || faker.address.latitude();
        },
        longitude: function (value) {
            return value || faker.address.longitude();
        },
        price: function (value) {
            return value || faker.commerce.price();
        },
        color: function (value) {
            return value || faker.commerce.color();
        },
        department: function (value) {
            return value || faker.commerce.department();
        },
        productName: function (value) {
            return value || faker.commerce.productname();
        },
        material: function (value) {
            return value || faker.commerce.priceMaterial();
        },
        company: function (value) {
            return value || faker.company.companyName();
        },
        pastDate: function (value) {
            return value || faker.date.past();
        },
        futureDate: function (value) {
            return value || faker.date.future();
        },
        account: function (value) {
            return value || faker.finance.account();
        },
        transactionType: function (value) {
            return value || faker.finance.transactionType();
        },
        currencyCode: function (value) {
            return value || faker.finance.currencyCode();
        },
        currencyName: function (value) {
            return value || faker.finance.currencyName();
        },
        image: function (value) {
            return value || faker.image.image();
        },
        email: function (value) {
            return value || faker.internet.email();
        },
        userName: function (value) {
            return value || faker.internet.userName();
        },
        url: function (value) {
            return value || faker.internet.url();
        },
        ip: function (value) {
            return value || faker.internet.ip();
        },
        firstName: function (value) {
            return value || faker.name.firstName();
        },
        lastName: function (value) {
            return value || faker.name.lastName();
        },
        title: function (value) {
            return value || faker.name.title();
        },
        number: function (value) {
            return value || faker.random.number();
        },
        uuid: function (value) {
            return value || faker.random.uuid();
        },
        boolean: function (value) {
            return value || faker.random.boolean();
        },
        phoneNumber: function (value) {

            return value || faker.phone.phoneNumber();
        },
        sex: function (value) {
            return value || faker.random.sex();
        },
        medicineName: function (value) {
            return value || faker.medicine.name();
        }
    };

    return function (type, value) {
        if (Object.keys(strategy).indexOf(type) == -1) {
            return null;
        } else {
            return strategy[type](value);
        }
    };
}();

function parse(type) {
    return dataStrategy(type);
}

function composeData(data, dataFormat, fn) {
    for (var obj in dataFormat) {
        if (dataFormat[obj]) {
            switch (dataFormat[obj].type) {
                case "Obj":
                    data[obj] = data[obj] || {};
                    composeData(data[obj], dataFormat[obj].data, fn);
                    break;
                case "Array":
                    for (var index = 0; index < dataFormat[obj].num; index++) {
                        data[obj] = data[obj] || [];
                        if (dataFormat[obj].subType == "basic") {
                            data[obj].push(fn(dataFormat[obj].data.type));
                        } else {
                            data[obj].push({});
                            composeData(data[obj][index], dataFormat[obj].data, fn);
                        }
                    }
                    break;
                default:
                    data[obj] = fn(dataFormat[obj].type);
                    break;
            }
        }
    }
}

// composeData(data, dataFormat, parse);
// console.log(data);

var proto = module.exports = function (options) {

    faker.locale = "zh_CN";
    // var mock={
    //
    // };
    //
    //
    //
    //
    // return mock;
    return {
        format: options
    };
}();

proto.mock = function () {
    if (dataFormat) {
        var data = {
            http: "1.1",
            json: "0.0.1",
            error: null
        };
        if (this.format) {
            composeData(data, this.format, parse);
        } else {
            composeData(data, dataFormat, parse);
        }
    }
    return data;
};

//# sourceMappingURL=index-compiled.js.map