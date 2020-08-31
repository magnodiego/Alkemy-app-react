import React from 'react';
import Axios from 'axios';
import ProfileApps from './ProfileApps';

export default class ClientProfile extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            user: JSON.parse(localStorage.getItem('user')),
            noWishlistApps: ''
        }
    }

    componentDidMount(){
        // Get user apps
        try {
            const userApps = this.state.user.apps.split(',')
            console.log(userApps)
            Axios.get(
                `http://localhost:8080/api/me/profile/userApps?userApps=${userApps}`
            ).then((res)=>{
                this.setState({
                    noUserApps: false,
                    userApps: res.data.map(element => { return element}).map(element => { return element })
                })
            })
        } catch (error) {
            this.setState({noUserApps: true})
        }


        // Get wishlist apps
        try {
            const wishlist = this.state.user.wishlist.split(',')
            Axios.get(
                `http://localhost:8080/api/me/profile/wishlist?wishlist=${wishlist}`
            ).then((res)=>{
                this.setState({
                    noWishlistApps: false,
                    wishlistApps: res.data.map(element => { return element}).map(element => { return element })
                })
            })
        } catch (error) {
            this.setState({noWishlistApps: true})
        }
        
    }

    render(){
        const { user } = this.state;
        const { noWishlistApps } = this.state;
        const { wishlistApps } = this.state;
        const { userApps } = this.state;
        const { noUserApps } = this.state;

        return(
            <div>
            <div>
                <div className="jumbotron jumbotron-fluid">
                    <div className="container">
                        <h1 className="display-3 text-capitalize"> Hello {user.name}!</h1>
                        <p className="lead">Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam, quis.</p>
                    </div>
                </div>
            </div>
            <div className='mb-5'>
                <div className="container" >
                    <h2 className='mb-4 mt-5'> Your apps!  </h2>
                </div>
                <div className="album py-5 bg-light">   
                    <div className='container'>
                        <div className="row">
                            <p className="lead"> {noUserApps ? 'There are no apps in your wishlist.' : '' }</p>
                            <div className="card-group">
                            {userApps && userApps.map( (element, index) =>  <ProfileApps apps={ element } index={index} key={ index }/> )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container" >
                    <h2 className='mb-4 mt-5'> Your Wishlist!  </h2>
                </div>
                <div className="album py-5 bg-light">   
                    <div className='container'>
                        <div className="row">
                            <p className="lead"> {noWishlistApps ? 'There are no apps in your wishlist.' : '' }</p>
                            <div className="card-group">
                            {wishlistApps && wishlistApps.map( (element, index) =>  <ProfileApps apps={ element } index={index} key={ index }/> )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        )
    }
}