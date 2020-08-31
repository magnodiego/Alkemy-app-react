import React from 'react';

export default class ErrorInput extends React.Component {
    
    render(){
        return(
            <div {...this.props} className="invalid-feedback "/>
        )
    }

}