import React from 'react';
import Axios from 'axios';
import ErrorInput from './ErrorInput';
import SuccessForm from './SuccessForm'
import InfoInput from './InfoInput';
import ErrorForm from './ErrorForm';
import Spinner from './Spinner';

const validate = values => {
    const errors = {}
    if(!values.name ){
        errors.name = 'Enter your first name.'
    }
    if(!values.lastName){
        errors.lastName = 'Enter your last name.'
    }
    if(!values.role){
        errors.role = 'Enter your user role.'
    }
    if(!values.username || values.username.length < 4 || values.username.length > 10){
        errors.username = 'Enter a valid username. It must be 4-10 characters long.'
    }
    if(!values.password || values.password.length < 4 || values.password.length > 10 ){
        errors.password = 'Enter a valid password. It must be 4-10 characters long.'
    }
    if(values.confirmPassword !== values.password || !values.confirmPassword ){
        errors.confirmPassword = 'Passwords do not match.'
    }
    return errors
}

export default class RegisterForm extends React.Component {
    state = {
        errors: {}
    }

    handleChange = ({target})=>{
        const{ name, value } = target
        this.setState({ [name]: value })
    }

    handleSubmit = (e)=>{
        e.preventDefault();

        const { errors, ...stateValues} = this.state;
        const result = validate(stateValues);
        this.setState({ errors: result });

        if(!Object.keys(result).length){
            this.setState({send: true});
            Axios.post(
                'http://localhost:8080/api/register',
                stateValues
            ).then((res)=>{
                this.setState({sendError: false})
                this.setState({send: false});
                window.scrollTo(0, 0)
                switch (res.status) {
                    case 200:
                        this.setState({sendSuccess: true})
                        break;
                default:
                    this.setState({sendError: true}) 
                    this.setState({
                        errors:{
                            serveError: `Can't connect to server, please try again in a few minutes.`
                        }})
                    break;
                }
            }).catch((error )=>{
                switch (error.response.status) {
                    case 502:
                        this.setState({sendError: true})
                        this.setState({
                            errors:{
                                serveError: 'This username is already taken, please select another one.'
                            }
                        })
                        break;
                    default:
                        this.setState({sendError: true}) 
                        this.setState({
                            errors:{
                                serveError: `Can't connect to server, please try again in a few minutes.`
                            }})
                        break;
                }
                this.setState({send: false});
                window.scrollTo(0, 0)
            })
        }
    }

    render(){
        const { errors } = this.state;
        const { sendSuccess } = this.state;
        const { sendError } = this.state;
        const { send } = this.state;

        return(
            <div>
            
            <div className="col-lg-9 p-5 mx-auto">
                {sendSuccess && <SuccessForm> The user has been created, redirecting to sign in. </SuccessForm>}
                {sendError && <ErrorForm> {errors.serveError} </ErrorForm>}
                <div className=" shadow-lg p-5 mb-5 bg-white rounded" >
                    <div className='mb-4 center'>
                        <h4 className='userRegister'>Register User</h4>
                    </div>
                    <form method='POST' onSubmit={this.handleSubmit} noValidate>
                        <div className="form-row">
                            <div className="form-group col-md-6">
                                <label htmlFor="name">First name</label>
                                <input type="text" name='name' className={`form-control ${!errors.name ? '' : 'is-invalid' } `} id='inputRegister' required onChange={this.handleChange}/>
                                {errors.name && <ErrorInput>{errors.name}</ErrorInput>}
                            </div>
                           <div className="form-group col-md-6">
                                <label htmlFor="lastName" >Last name</label>
                                <input type="text" name='lastName' className={`form-control ${!errors.lastName ? '' : 'is-invalid' }`} required onChange={this.handleChange}/>
                                {errors.lastName && <ErrorInput>{errors.lastName}</ErrorInput>}
                            </div>
                        </div>
                         <div className="form-group">
                            <label htmlFor="role">Role</label>
                            <select className={`form-control ${!errors.role ? '' : 'is-invalid' }`} name='role' required onChange={this.handleChange}>
                                    <option></option>
                                <option>Client</option>
                                <option>Developer</option>
                            </select>
                            {errors.role && <ErrorInput>{errors.role}</ErrorInput>}
                        </div>             
                        <div className="form-group">
                            <label htmlFor="username"> Username </label>
                            <input type="text" name='username' className={`form-control ${!errors.username ? '' : 'is-invalid' }`} required onChange={this.handleChange}/>
                            {errors.username && <ErrorInput>{errors.username}</ErrorInput>}
                            {!errors.username && <InfoInput>{'Your username must be 4-10 characters long.'}</InfoInput>}
                        </div>  
                        <div className="form-group">
                            <label htmlFor="password"> Password </label>
                            <input type="password" name='password' className={`form-control ${!errors.password ? '' : 'is-invalid' }`} required onChange={this.handleChange}/>
                            {errors.password && <ErrorInput>{errors.password}</ErrorInput>}
                            {!errors.password && <InfoInput>{'Your password must be 4-10 characters long.'}</InfoInput>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword"> Confirm password </label>
                            <input type="password" name='confirmPassword' className={`form-control ${!errors.confirmPassword ? '' : 'is-invalid' }`} required  onChange={this.handleChange}/>
                            {errors.confirmPassword && <ErrorInput>{errors.confirmPassword}</ErrorInput>}
                        </div>
                        <div className="center">
                            <button type="submit" className="btn btn-success center"> Register  {send && <Spinner/>} </button>
                            
                        </div> 
                    </form>
                </div>
            </div>
            </div>
        )
    }
}