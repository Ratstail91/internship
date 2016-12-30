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

//Form list
node = document.createElement("DIV");
node.className = "left";
ReactDOM.render(<FormList fname="fname" lname="lname" email="email" birthdate="birthdate" income="income" />, node);
document.getElementById("root").appendChild(node);

//Unordered list
node = document.createElement("DIV");
node.className = "right";
ReactDOM.render(<UnorderedList />, node);
document.getElementById("root").appendChild(node);

//footer
node = document.createElement("DIV");
ReactDOM.render(<Footer copyright="Kayne Ruse" copyrightYear="2016" />, node);
document.getElementById("root").appendChild(node);

//setup the page's state
refreshDatabase();
