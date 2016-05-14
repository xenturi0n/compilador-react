var React = require('react');

var MyComponent = React.createClass({
    render: function () {
        return (<div>Mi componente {this.props.name}</div>)
    }
})