var React = require('react');
var ReactDOM = require('react-dom');
var componente = require('./componente.jsx');



function run() {
    ReactDOM.render(
        <componente />, document.getElementById('app')
    );
}

const loadedStates = ['complete', 'loaded', 'interactive'];

if (loadedStates.includes(document.readyState) && document.body) {
    run();
} else {
    window.addEventListener('DOMContentLoaded', run, false);
}