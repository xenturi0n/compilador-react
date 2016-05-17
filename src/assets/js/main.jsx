import React from 'react';
import ReactDOM from 'react-dom';

import HelloMessage from './components/HelloMessage.jsx';


const InputBox = React.createClass({
    _edit: function(){
        this.setState({isEdit: !this.state.isEdit});
    },
    _update: function(){
        this.props.update(this.refs.userInput.value);
        this.setState({isEdit: !this.state.isEdit});
        this.refs.userInput.value="";
    },
    getInitialState: function(){
        return {
            isEdit: false
        }
    },
    render: function () {
        return (
            <div>
            
                <label htmlFor={this.props.id}>
                    {this.props.label}
                </label>
                
                <input type="text" 
                       id={this.props.id} 
                       name={this.props.id}
                       ref="userInput"
                       disabled={!this.state.isEdit}/>
                
                <button onClick={this.state.isEdit ? this._update : this._edit}>
                    {this.state.isEdit ? "Update" : "Edit"}
                </button>
                
            </div>
        );
    }
});


const HelloReact = React.createClass({

    getInitialState: function () {
        return {
            nombre: '',
            apellidos: ''
        }
    },

    _changeMessage: function () {
        this.setState({ nombre: this.refs.inputBox.value });
    },

    _update: function (key, value) {
        var newState = {};
        newState[key] = value;
        this.setState(newState);
    },

    render: function () {
        return (
            <div>

                <HelloMessage message={'Hola ' +
                    this.state.nombre + ' ' +
                    this.state.apellidos} />

                <InputBox id="nombre"
                    label="Nombre"
                    update={this._update.bind(null, 'nombre') } />

                <InputBox id="Apellido"
                    label="Apellido"
                    update={this._update.bind(null, 'apellidos') } />
            </div>
        );
    }
});



ReactDOM.render(<HelloReact />, document.getElementById('app'));