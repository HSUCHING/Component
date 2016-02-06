/**
 * Created by chinghsu on 16/2/2.
 */
var TextToSVG = require('text-to-svg').TextToSVG;
var textToSVG = new TextToSVG(file='/Users/chinghsu/Documents/Frontend_Development/Library/Component/TextToSvg/Comic\ Sans\ MS.ttf');

var attributes = {fill: 'red', stroke: 'black'};
var options = {x: 0, y: 50, fontSize: 72, attributes: attributes};

var svg = textToSVG.getSVG('Ethicall', options);

console.log(svg);