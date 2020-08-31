import React from 'react';
import Axios from 'axios';
import Details from '../main/Details';

export default class ProfileApps extends React.Component {
    
    constructor(props){
        super(props)

        this.state = {
            user: JSON.parse(localStorage.getItem('user')),
            appImage: '',
            apps: this.props.apps[0],
            modal: false
        }
    }

    componentDidMount(){
        // Short description
        let shortDescrip = ''
        const shortD = this.state.apps.descript.split(' ')
        if(shortD.length > 15){
            for (let i = 0; i < 15; i++) {
                if(i !== 14) {
                    shortDescrip += shortD[i]
                    shortDescrip += ' '
                }else{
                    shortDescrip += shortD[i]
                    shortDescrip += '...'
                }   
            }
            this.setState({shortDescription: shortDescrip})
        } else {
            this.setState({shortDescription: this.props.apps[0].descript})
        }
       
        // Get app photo
        Axios.get(
            `http://localhost:8080/api/app/card/image?img=${this.state.apps.photo}`,
            {responseType: 'blob'}
        ).then((res)=>{
            const imageUrl = URL.createObjectURL(res.data)
            this.setState({appImage: imageUrl})
        }).catch((err)=>{   
        })

        // Check if the apps were already bought
        try {
            const userApps = JSON.parse(localStorage.getItem('user')).apps
            if(userApps ){
                userApps.split(',').forEach(element => {
                    if(element === this.state.apps.apphash ){
                        this.setState({
                            alreadyBought: true
                        })
                    }
                });
            }
        } catch (error) {
            
        }

        // Check if the apps is already in the cart
        
        const cartApps = JSON.parse(localStorage.getItem('cart'))
        if(cartApps ){
            cartApps.forEach(element => {
                if(element.apphash === this.state.apps.apphash ){
                    this.setState({
                        alreadyInCart: true
                    }, console.log(this.state))
                }
            });
        }
    }

    openModal = () => this.setState({modal: true})

    closeModal = () => this.setState({modal: false})

    priceFormat = (value)=>{
        let price = value.toFixed(2).toString().split('.');
        price[0] = price[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        return price.join(',')
    }

    addToCart = () => {
        let cart = JSON.parse(localStorage.getItem('cart'))
        if(cart){
            let newItem = this.state.apps
            cart.push(newItem)
            localStorage.removeItem('cart')
            localStorage.setItem('cart', JSON.stringify(cart))
        }else{
            localStorage.removeItem('cart')
            localStorage.setItem('cart', JSON.stringify([this.state.apps]))
        }
        this.setState({
            added: true
        })
    }

    render(){
        const { apps } = this.state;
        const { appImage } = this.state;
        const { shortDescription } = this.state; 
        const { modal } = this.state;
        const { user } = this.state;
        const { alreadyBought } = this.state;
        const { alreadyInCart } = this.state;
        const { added } = this.state;

        return(
            <div>
                <div className="col-md-4 ">
                    <div className="card mb-4 shadow-sm cardSize" >
                        <img src={appImage} className="card-img-top h-50" width="100%" alt="App logo"/>
                        <div className="card-body">
                        <h5 className="card-title cardFormat">{apps.name}</h5>
                            <p className="card-text"> {shortDescription} </p>
                            <div className="text-right">
                                <h3 className="pricing-card-title"> {apps.price === 0 ? 'Free!' : `$ ${this.priceFormat(apps.price)}` }</h3>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="btn-group btn-group-sm">
                                    <button onClick={this.openModal} className='btn btn-sm btn-secondary'> Details </button>
                                    {modal && <Details app={apps} appImg={appImage} closeModal={this.closeModal} modal={modal} priceFormat={this.priceFormat}/>}
                                    <button onClick={this.addToCart} className={user.hash === apps.userhash || alreadyBought ? 'd-none' : "btn btn-sm btn-primary"} disabled={ added || alreadyInCart } > Add to cart! </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}