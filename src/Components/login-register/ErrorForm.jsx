import React from 'react';

export default class ErrorForm extends React.Component {
    
    render(){
        return(
            <div className="alert alert-danger" role="alert">
                <h4 className="alert-heading">Ups! </h4>
                <p {...this.props}></p>
            </div>
        )
    }

}