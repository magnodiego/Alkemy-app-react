import React from 'react';
import ErrorInput from './ErrorInput';
import ErrorForm from './ErrorForm';
import Axios from 'axios';


const validate = values => {
    const errors = {}
    if(!values.username){
        errors.username = 'Enter your username.'
    }
    if(!values.password){
        errors.password = 'Enter your password.'
    }
    return errors
}

export default class Login extends React.Component {

    state = {
        errors: {}
    }

    handleChange = ({target})=>{
        const{ name, value } = target
        this.setState({ [name]: value })
    }

    handleSubmit = (e)=>{
        e.preventDefault()
        const { errors, ...stateValues} = this.state
        const result = validate(stateValues)
        this.setState({ errors: result })
        if(!Object.keys(result).length){
            this.setState({send: true});
            Axios.post(
                `http://localhost:8080/api/login`,
                stateValues
            ).then((response)=>{
                const { user } = response.data
                localStorage.setItem('user', JSON.stringify(user))
                this.setState({send: false});
                window.location = '/main';
            }).catch((err)=>{
                console.log(err)
                this.setState({sendError: 'Please check your user information a try again.'})
                this.setState({
                    errors:{
                        username: ' ',
                        password: ' '
                    }
                })
                this.setState({send: false});
                window.scrollTo(0, 0)
            })
        }
    }


    render(){
        const { errors } = this.state;
        const { sendError } = this.state;

        return(
            <div>
                <div className="col-lg-6 p-5 mx-auto ">
                    {sendError && <ErrorForm>{sendError} </ErrorForm>}
                    <div className=" shadow-lg p-5 mb-5 bg-white rounded" >
                        <form method='POST' noValidate>
                            <div className="form-group">
                                <label htmlFor="username"> Username </label>
                                <input type="text" name='username' className={`form-control ${!errors.username ? '' : 'is-invalid' } `} required onChange={this.handleChange}/>
                                {errors.username && <ErrorInput>{errors.username}</ErrorInput>}
                            </div>  
                            <div className="form-group">
                                <label htmlFor="password"> Password </label>
                                <input type="password" name='password' className={`form-control ${!errors.password ? '' : 'is-invalid' } `} required onChange={this.handleChange}/>
                                {errors.password && <ErrorInput>{errors.password}</ErrorInput>}
                            </div>
                            <button type="submit" className="btn btn-success m-1" onClick={this.handleSubmit}> Sign in </button>
                        </form>
                    </div>
                </div>
                
            </div>
        )
    }
}