// var exportsOfFile = require("coffee!./file.coffee");
// require('style!css!less!./a.less');
// require('./b.css');
// require('style!css!sass!./c.sass');
var React = require('react');
var ReactDom = require('react-dom');
var ReactDomServer = require('react-dom/server');

//V1

// var reactElement=React.createElement('h1',{className:"reactTitle"},'React');
// console.log(ReactDomServer.renderToString(reactElement));
// ReactDom.render(reactElement,document.getElementById('react-application'));


//V2
// var listItemElement1 = React.DOM.li({className: 'item-1', key: 'item-1'}, 'Item 1');
// var listItemElement2 = React.DOM.li({className: 'item-2', key: 'item-2'}, 'Item 2');
// var listItemElement3 = React.DOM.li({className: 'item-3', key: 'item-3'}, 'Item 3');
//
// var reactFragment = [listItemElement1, listItemElement2, listItemElement3];
// var listOfItems = React.DOM.ul({className: 'list-of-items'}, reactFragment);
// ReactDom.render(listOfItems, document.getElementById('react-application'));

//V3
// var createListItemElement =React.createFactory('li');
// var listItemElement1 =createListItemElement({className:'item-1',key:'item1'},'Item1');
// var listItemElement2 =createListItemElement({className:'item-2',key:'item2'},'Item2');
// var listItemElement3 =createListItemElement({className:'item-3',key:'item3'},'Item3');
// var reactFragment = [listItemElement1, listItemElement2, listItemElement3];
// var listOfItems = React.DOM.ul({className: 'list-of-items'}, reactFragment);
// ReactDom.render(listOfItems, document.getElementById('react-application'));


// V4
var listOfItems = <ul className="list-of-items">
                    <li className="item-1">Item 1</li>
                    <li className="item-2">Item 2</li>
                    <li className="item-3">Item 3</li>
                </ul>;

ReactDom.render(listOfItems, document.getElementById('react-application'));

