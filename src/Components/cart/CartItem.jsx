import React from 'react';

export default class CartItem extends React.Component {

    constructor(props){
        super(props)

        this.state= {
            app : this.props.app
        }
    }

    render(){
        const { app } = this.state;
        return(
            <li className="list-group-item d-flex justify-content-between lh-condensed">
                <div>
                <h6 className="my-0">{app.name}</h6>
                    <small className="text-muted"> {app.category} </small>
                </div>
                <span className="text-muted"> {app.price === 0 ? 'Free!' : `$ ${this.props.priceFormat(app.price)}` } </span>
            </li>
        )
    }

}
