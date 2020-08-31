import React from 'react';
import Axios from 'axios';
import Details from './Details';

export default class AppCard extends React.Component {
    
    constructor(props){
        super(props)

        this.state = {
            appImage: '',
            apps: this.props.apps,
            modal: false,
            hide: false,
            user: '',
            guest: '',
            alreadyInWishlist: ''
        }
    }

    componentDidMount(){
        try {
            this.setState({
                user: JSON.parse(localStorage.getItem('user')),
                guest: false
            })
        } catch (error) {
            this.setState({guest: true}, ()=>{
                console.log(this.state)
            })
        }

        // Short description
        let shortDescrip = ''
        const shortD = this.props.apps.descript.split(' ')
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
            this.setState({shortDescription: this.props.apps.descript})
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

        // Check if it is already in the user wishlist
        try {
            const wishlist = JSON.parse(localStorage.getItem('user')).wishlist
            if(wishlist || this.state.apps.userHash === this.state.user.hash ){
            wishlist.split(',').forEach(element => {
                if(element === this.state.apps.apphash ){
                    this.setState({
                       alreadyInWishlist: true
                    })
                }
            });
        }
        } catch (error) {
            
        }

        // Check if the apps were already bought
        try {
            const cartApps = JSON.parse(localStorage.getItem('user')).apps
            if(cartApps ){
                cartApps.split(',').forEach(element => {
                    if(element === this.state.apps.apphash ){
                        this.setState({
                            alreadyBought: true
                        })
                    }
            });
        }
        } catch (error) {
            
        }


    }

    priceFormat = (value)=>{
        let price = value.toFixed(2).toString().split('.');
        price[0] = price[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        return price.join(',')
    }

    openModal = () => this.setState({modal: true})

    closeModal = () => this.setState({modal: false})

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
    }

    addToWishlist = ({target}) => {
        const wishlist = JSON.parse(localStorage.getItem('user')).wishlist
        const newItem = this.state.apps.apphash
        const userHash = this.state.user.hash;
        
        if(!wishlist){
            let newWishlist = newItem;
            const data = {userHash, newWishlist}
            Axios.post(
                'http://localhost:8080/api/buy/update/wishlist',
                data
            ).then((res)=>{
                const user  = res.data
                localStorage.setItem('user', JSON.stringify(user))
                this.setState({
                    alreadyInWishlist: true
                 })
            }).catch((err)=>{
                console.log(err)
            })
        }else {
            let newWishlist = [wishlist].concat(this.state.apps.apphash).toString()
            const data = {userHash, newWishlist}
            Axios.post(
                'http://localhost:8080/api/buy/update/wishlist',
                data
            ).then((res)=>{
                const user  = res.data
                localStorage.setItem('user', JSON.stringify(user))
                this.setState({
                    alreadyInWishlist: true
                 })
            }).catch((err)=>{
                console.log(err)
            })
        }
    }

    render(){
        const { apps } = this.state;
        const { appImage } = this.state;
        const { shortDescription } = this.state; 
        const { modal } = this.state;
        const { user } = this.state;
        const { alreadyInWishlist } = this.state;
        const { alreadyBought } = this.state;

        return(
            <div>
                <div className="col-md-4">
                    <div className="card mb-4 shadow-sm cardSize" >
                        <img src={appImage} className="card-img-top h-50" width="100%" alt="App logo"/>
                        <div className="card-body">
                        <h5 className="card-title cardFormat">{apps.name}</h5>
                            <p className="card-text "> {shortDescription} </p>
                            <div className="text-right">
                                <h3 className="pricing-card-title"> {apps.price === 0 ? 'Free!' : `$ ${this.priceFormat(apps.price)}` }</h3>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="btn-group btn-group-sm">
                                    <button onClick={this.openModal} className='btn btn-sm btn-secondary'> Details </button>
                                    {modal && <Details app={apps} appImg={appImage} closeModal={this.closeModal} modal={modal} priceFormat={this.priceFormat}/>}
                                    {user && <button onClick={this.addToWishlist} className={ (user.hash === apps.userhash) ? 'd-none' : 'btn btn-outline-danger border-left-0'}  disabled={alreadyInWishlist || alreadyBought}> { alreadyInWishlist ? 'Already in your wishlist' : 'Add to wishlist' } </button>}
                                    {user && <button onClick={this.addToCart} className={user.hash === apps.userhash ? 'd-none' : "btn btn-sm btn-primary"} disabled={alreadyBought}> Add to cart! </button> }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}