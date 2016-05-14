var React = require('react');
var ReactDOM = require('react-dom');

var MyComponent = React.createClass({
    render: function () {
        return (<div>MyComponent {this.props.name}</div>)
    }
})


function run() {
    ReactDOM.render(
        <MyComponent />, document.getElementById('app')
    );
}

const loadedStates = ['complete', 'loaded', 'interactive'];

if (loadedStates.includes(document.readyState) && document.body) {
    run();
} else {
    window.addEventListener('DOMContentLoaded', run, false);
}