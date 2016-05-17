import React from 'react';
import {render} from 'react-dom';

// const HelloMessage = React.createClass({
//     render: function(){
//         return (
//             <h1>
//                 {this.props.message}
//             </h1>
//         );
//     }
// });


const HelloMessage = props => (
    <h1>{props.message}</h1>
);

export default HelloMessage;