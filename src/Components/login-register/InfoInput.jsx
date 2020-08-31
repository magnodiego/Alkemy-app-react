import React from 'react';

export default class InfoInput extends React.Component {
    
    render(){
        return(
            <small {...this.props} className="form-text text-muted"/>
        )
    }

}