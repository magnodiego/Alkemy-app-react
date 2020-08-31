import React from 'react';
import { Switch, Route, Redirect } from 'react-router';
import RegisterForm from './login-register/RegisterForm';
import Login from './login-register/Login';
import Main from './main/Main';
import DeveloperRegisterApp from './profile/DeveloperRegisterApp';
import MainNavbar from './main/MainNavbar';
import CategoryApps from './main/CategoryApps';
import ClientProfile from './profile/ClientProfile';
import DeveloperProfile from './profile/DeveloperProfile';
import CheckOut from './cart/CheckOut';



export default ()=>{
    
    return(
        <div>
        <MainNavbar/>
        <Switch>
            <Route exact path='/' component={Main}> 
                {localStorage.getItem('user') && <Redirect to='/main'/>}
            </Route>
            <Route exact path='/login' component={Login}> 
                {localStorage.getItem('user') && <Redirect to='/main'/>}
            </Route>
            <Route path='/register' component={RegisterForm}>
                {localStorage.getItem('user') && <Redirect to='/main'/>}
            </Route>
            <Route exact path='/main' component={Main}/>
            <Route exact path='/me/client/profile' component={ClientProfile}>
                {!localStorage.getItem('user') && <Redirect to='/login'/>}
            </Route>
            <Route path='/me/developer/profile' component={DeveloperProfile}>
                {!localStorage.getItem('user') && <Redirect to='/login'/>}
            </Route>
            <Route  path='/me/developer/apps' component={DeveloperRegisterApp}> 
                {!localStorage.getItem('user') && <Redirect to='/login'/>}
            </Route>
            <Route  path='/me/checkout' component={CheckOut}> 
                {!localStorage.getItem('user') && <Redirect to='/login'/>}
            </Route>

            <Route exact path='/main/Games/apps' component={()=><CategoryApps/>}/>
            <Route exact path='/main/All/apps' component={()=><CategoryApps/>}/> 
            <Route exact path='/main/Education/apps' component={()=><CategoryApps/>}/> 
            <Route exact path='/main/Finance/apps' component={()=><CategoryApps/>}/> 
            <Route exact path='/main/Social/apps' component={()=><CategoryApps/>}/> 
            <Route exact path='/main/Others/apps' component={()=><CategoryApps/>}/> 
            <Route exact path='/main/Sports/apps' component={()=><CategoryApps/>}/> 
            <Route exact path='/main/Weather/apps' component={()=><CategoryApps/>}/> 


            <Route component={Main}> 
                <Redirect to='/main'/>
            </Route>
        </Switch>
        </div>
    )
}