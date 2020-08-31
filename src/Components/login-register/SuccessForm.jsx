import React from 'react';
import { Redirect } from 'react-router';

export default class SuccessForm extends React.Component {
    state = {}


    redirect = ()=>{
        setTimeout(() => {
            this.setState({redirect: true})
        }, 2000)
    }

    render(){
        const { redirect } = this.state;
        return(
            <div className="alert alert-success" role="alert">
                <h4 className="alert-heading">Well done!</h4>
                <p {...this.props}></p>
                {this.redirect()}
                {window.location.pathname === '/register' && redirect && <Redirect to='/login'/>}
                {window.location.pathname === '/me/checkout' && redirect && <Redirect to='/'/>}
            </div>
        )
    }

}