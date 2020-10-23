import React from 'react';
import ReactDOM from 'react-dom';
import './Modal.css';

const container = document.getElementById('modal-root');

class Modal extends React.Component{
    constructor(props){
        super();
        this.el = document.createElement('div');
    }

    componentDidMount(){
        container.appendChild(this.el);
    }

    componentWillUnmount(){
        container.removeChild(this.el);
    }

    render(){
        return ReactDOM.createPortal(this.props.children,container);
    }
}

export default Modal;