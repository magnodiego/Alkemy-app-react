import React from 'react';
import CartItem from './CartItem';
import Axios from 'axios';
import SuccessForm from '../login-register/SuccessForm';

export default class CheckOut extends React.Component {
    
    constructor(props){
        super(props)
        
        this.state = {
            cartApps: JSON.parse(localStorage.getItem('cart'))
        }

    }

    componentDidMount(){
        try {
            let total = 0
            this.state.cartApps.forEach((element, i) => {
                total += element.price
            });
            this.setState({
                total: this.priceFormat(total),
            }) 
        } catch (error) {
            this.setState({
                total: 0,
            }) 
        }
    }

    priceFormat = (value)=>{
        let price = value.toFixed(2).toString().split('.');
        price[0] = price[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        return price.join(',')
    }

    handleSubmit = (e)=>{
        const userApps = JSON.parse(localStorage.getItem('user')).apps
        let newItems = []
        this.state.cartApps.forEach((element, i)=>{
            newItems[i] = element.apphash
        })
        const userHash = JSON.parse(localStorage.getItem('user')).hash;

    // Update user apps
        if(!userApps){
            let newUserApps = newItems.toString();
            const data = {userHash, newUserApps}
            Axios.post(
                'http://localhost:8080/api/buy/update/userApps',
                data
            ).then((res)=>{
                const user  = res.data
                localStorage.setItem('user', JSON.stringify(user))
                localStorage.removeItem('cart')
                this.setState({
                    send: true
                })
            }).catch((err)=>{
                console.log(err)
            })
        }else {
            let newUserApps = [userApps].concat(newItems).toString()
            const data = {userHash, newUserApps}
            Axios.post(
                'http://localhost:8080/api/buy/update/userApps',
                data
            ).then((res)=>{
                const user  = res.data
                localStorage.setItem('user', JSON.stringify(user))
                localStorage.removeItem('cart')
                this.setState({
                    send: true
                })
            }).catch((err)=>{
                console.log(err)
            })
        }
    }

    render(){
        const { cartApps } = this.state;
        const { total } = this.state;
        const { send } = this.state;

        return(
            <div>
                <div className="col-md-12 d-flex center mt-5">
                <div className="col-md-6 order-md-2 mb-4">
                    <h4 className="d-flex justify-content-between align-items-center mb-3">
                        <span className="text-muted">Your cart</span>
                    </h4>
                    <ul className="list-group mb-3">
                        {cartApps && cartApps.map( (element, index) =>  <CartItem app={ element } key={ index } deleteItem={this.deleteItem} priceFormat={this.priceFormat}/>  )}
                        <li className="list-group-item d-flex justify-content-between">
                            <span>Total </span>
                            <strong>$ { total }</strong>
                        </li>
                    </ul>
                    <button className="btn btn-primary mt-2 btn-lg btn-block" onClick={this.handleSubmit} type="submit" disabled={!cartApps}>Buy!</button>
                    {send && <SuccessForm> Thank you for your purchases, redirecting to main. </SuccessForm>}
                </div>
                </div>
            </div>
        )
    }
}