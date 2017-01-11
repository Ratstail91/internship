import React from 'react';
import ReactDOM from 'react-dom';

//includes
import Header from './header.jsx';
import FormList from './form_list.jsx';
import UnorderedList from './unordered_list.jsx';
import Footer from './footer.jsx';

//this convention allows for multiple .jsx thingys on one page
var node = null;

//footer
node = document.createElement("DIV");
ReactDOM.render(<Header />, node);
document.getElementById("root").appendChild(node);

//super
var superNode = document.createElement("DIV");
superNode.className = "super";

//Form list
node = document.createElement("DIV");
node.className = "superleft";
ReactDOM.render(<FormList fname="fname" lname="lname" email="email" birthdate="birthdate" income="income" />, node);
superNode.appendChild(node);

//Unordered list
node = document.createElement("DIV");
node.className = "superright";
ReactDOM.render(<UnorderedList />, node);
superNode.appendChild(node);

//super
document.getElementById("root").appendChild(superNode);

//footer
node = document.createElement("DIV");
ReactDOM.render(<Footer copyright="Kayne Ruse" copyrightYear="2016" />, node);
document.getElementById("root").appendChild(node);

//setup the page's state
//TODO
