// require('style!css!less!./bower_components/bootstrap/bootstrap.less');
// require('style!css!./styles/main.css');
// require('url!./images/logo.png');
// require('json!./data.json');
// require('./scripts/main.js');
// var exportsOfFile = require("coffee!./file.coffee");
// require('babel!./scripts/es6.js');
// require('style!css!less!./source/a.less');

// module.exports = {
//     entry: {
//         "entry": ["./source/app.js"]
//     },
//     output: {
//         path: "build",
//         filename: "bundle.js"
//     },
//     module: {
//         loaders: [
//             {test: /\.css$/, loader: "style!css"},
//             {test: /\.coffee$/, loader: "coffee-loader"},
//             {test: /\.(png|jpg)$/, loader: "url-loader?limit=8192"},
//             {test: /\.less$/, loader: "style!css!less"}
//         ]
//     }
// };

var path = require("path");
module.exports = {
    
    entry: {
        "entry": ["./source/app.js"]
    },
    // output: {
    //     path: "build",
    //     filename: "bundle.js"
    // },
    // module: {
    //     loaders: [
    //         {test: /\.css$/, loader: "style!css"},
    //         {test: /\.coffee$/, loader: "coffee-loader"},
    //         {test: /\.(png|jpg)$/, loader: "url-loader?limit=8192"},
    //         {test: /\.less$/, loader: "style!css!less"}
    //     ]
    // }
    resolve:{
        extentions:["","js"],
        alias:{
            ajs:path.join(__dirname, "./source/a.js")
        }
    },
    output: {
        path: "build",
        filename: "bundle2.js"
    }
};