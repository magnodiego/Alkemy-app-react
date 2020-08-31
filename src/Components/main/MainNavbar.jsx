import React from 'react';
import { NavLink } from 'react-router-dom';
import logo from '../../assets/logo.png';
import ErrorInfo from '../login-register/ErrorInfo'
import Categories from './Categories';
import Axios from 'axios';



export default class MainNavbar extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            user: {
                role:''
            },
            isToggleOn: false,
            cart: '',
            guest: ''
        }

        this.handleClick = this.handleClick.bind(this);
    }

    componentDidMount(){
        try {
            const user = JSON.parse(localStorage.getItem('user'))
            if(user){
                this.setState({user: user })
                this.setState({guest: false})
            }else {
                this.setState({guest: true})
            }
        } catch (error) {
            this.setState({guest: true})
        }
        
        const cart = JSON.parse(localStorage.getItem('cart'))
        this.setState({cart: cart})
    
        Axios.get(
            'http://localhost:8080/api/main/categories'
        ).then((res)=>{
            this.setState({
                categories: res.data.map(element => { return element.category })
            })
        }).catch((err)=>{
            console.log(err)
        })
    }

    info = ()=>{
        try {
            if(this.state.user.role === 'Client'){
                this.setState({roleError: 'Only for developers'})
            }
        } catch (error) {
            this.setState({roleError: 'Only for developers'})
        }
    }

    deleteInfo = ()=>{
        try {
            if(this.state.user.role === 'Client'){
                this.setState({roleError: ''})
            }
        } catch (error) {
            this.setState({roleError: ''})
        }

    }

    handleClick() {
        this.setState(state => ({
            isToggleOn: !state.isToggleOn
        }));
    }

    signOff = ()=>{
        localStorage.removeItem('user')
        window.location.reload()
    }

    render(){
        const { role } = this.state.user;
        const { roleError } = this.state;
        const { isToggleOn } = this.state;
        const { guest } = this.state;

        return(
            <div>
            <nav className={guest ? "navbar navbar-light bg-light" : 'd-none'}>
                <NavLink exact to='/main' className="navbar-brand">
                    <img src={logo} width="30" height="30" alt="Logo" loading="lazy"/>
                    Alkemy project
                </NavLink>
                <div className="justify-content-center">     
                    <NavLink to='/login' >           
                        <button className="btn btn-primary mr-2 my-2 my-md-0 btn-sm" type="submit">Sign in</button>
                    </NavLink>
                    <NavLink to='/register'>  
                        <button className="btn btn-outline-secondary my-2 my-md-0 btn-sm" type="submit">Register</button>
                    </NavLink>
                </div>
            </nav>    
            <nav className={guest ? 'd-none ' : 'navbar navbar-light bg-light'} >
                <NavLink exact to='/main' className="navbar-brand" >
                    <img src={logo} width="30" height="30" alt="Logo" loading="lazy"/>
                    Alkemy project
                </NavLink>
                <div className='row'>
                    {guest && <NavLink to='/login' >           
                        <button className="btn btn-primary mr-2 my-2 my-md-0 btn-sm" type="submit">Sign in</button>
                    </NavLink>}
                    {!guest && <NavLink to='/login' >           
                        <button onClick={ this.signOff } className="btn btn-danger mr-2 my-2 my-md-0 btn-sm" type="submit">Sign off</button>
                    </NavLink>}
                    {!guest && <NavLink to='/me/checkout'>           
                        <button className="btn btn-primary mr-2 my-2 my-md-0 btn-sm" type="submit">
                            Check out!
                        </button>
                    </NavLink> }
                </div>
            </nav>
            <nav>
                <div className="navbar-expand navbar-light" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className={isToggleOn ? ' nav-link dropdown-toggle active' : 'nav-link dropdown-toggle' } onClick={this.handleClick} >
                                Categories 
                            {isToggleOn && <Categories handleClick={this.handleClick} categories={this.state.categories} ></Categories>}
                        </li>
                        <li className="nav-item">
                            <NavLink className='nav-link' activeClassName='active' exact to={role === 'Client' ? '/me/client/profile' : '/me/developer/profile'}>
                                Profile 
                            </NavLink>
                        </li>
                        <li className="nav-item" onMouseOver={this.info} onMouseLeave={this.deleteInfo}>
                            <NavLink to='/me/developer/apps' className={`nav-link ${role === 'Developer' ? '' : 'disabled'}`} > 
                                    Add a new app! 
                            </NavLink>
                            {roleError && <ErrorInfo>{roleError}</ErrorInfo>}
                        </li>
                    </ul>
                </div>
            </nav>
            </div>
        )
    }
}