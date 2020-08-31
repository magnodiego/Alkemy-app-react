import React from 'react';
import Axios from 'axios';
import Details from '../main/Details';
import SuccessForm from '../login-register/SuccessForm';
import ErrorInput from '../login-register/ErrorInput';
import ErrorForm from '../login-register/ErrorForm';
import { Spinner } from 'reactstrap';

const validate = values => {
    const errors = {}
    if(!values.descript || values.descript > 120  ){
        errors.descript = 'Make a change to update. 120 characters long max.'
    }
    if(!values.price || values.price < 0 || values.price.indexOf(',', 0) !== -1){
        errors.price = `Make a change to update. format 0.00`
    }
    return errors
}

export default class UpdateApp extends React.Component {
    
    constructor(props){
        super(props)

        this.state = {
            appImage: '',
            apps: this.props.apps[0],
            modal: false,
            errors: ''
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
    }

    openModal = () => this.setState({modal: true})

    closeModal = () => this.setState({modal: false})

    priceFormat = (value)=>{
        let price = value.toFixed(2).toString().split('.');
        price[0] = price[0].replace(/\B(?=(\d{3})+(?!\d))/g, ".")
        return price.join(',')
    }

    handleChange = ({target})=>{
        const{ name, value } = target
        this.setState({ [name]: value })
    }
    
    handleSubmit = (e)=>{
        console.log(e)
        e.preventDefault();
        const { descript, price } = this.state;
        let values = {descript, price}
        const result = validate(values);
        this.setState({ errors: result });
        values = {descript, price, apphash: this.state.apps.apphash}
        if(!Object.keys(result).length){
            this.setState({send: true})
            Axios.put(
                'http://localhost:8080/api/me/app/update',
                values
            ).then((res)=>{
                this.setState({
                    send: false,
                    sendSuccess: 'App updated, wait for reload'
                });
                setTimeout(() => {
                    window.location.reload()
                }, 2000);
            }).catch((err)=>{
                console.log(err)
            })
        }

            

            
    }


    render(){
        const { apps } = this.state;
        const { appImage } = this.state;
        const { modal } = this.state;
        const { sendSuccess } = this.state;
        const { sendError } = this.state;
        const { errors } = this.state;
        const { send } = this.state;

        return(
            <div>
                <div className="col-md-4 ">
                    <div className="card mb-4 shadow-sm cardSize" >
                        <img src={appImage} className="card-img-top h-50" width="100%" alt="App logo"/>
                        <div className="card-body">
                        <h5 className="card-title cardFormat">{apps.name}</h5>
                            <div className=" mt-2 text-left">
                                <label htmlFor="descript">Description</label>
                                <textarea className={`form-control mb-2 ${!errors.descript ? '' : 'is-invalid' }`} name='descript' placeholder={apps.descript} onChange={this.handleChange}/> 
                                {errors.descript && <ErrorInput>{errors.descript}</ErrorInput>}
                            </div> 
                            <div className=" mt-2 text-left">
                                <label htmlFor="price">Price</label>
                                <input className={`form-control mb-2 ${!errors.price ? '' : 'is-invalid' }`} name='price' placeholder={apps.price} onChange={this.handleChange}/> 
                                {errors.price && <ErrorInput>{errors.price}</ErrorInput>}
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                                <div className='row'>
                                    <div className="col-4">
                                    <button onClick={this.openModal} className='btn btn-sm btn-secondary'> Details </button>
                                    {modal && <Details app={apps} appImg={appImage} closeModal={this.closeModal} modal={modal} priceFormat={this.priceFormat}/>}
                                    </div>
                                    <div className="col-8">
                                    <button onClick={this.handleSubmit} className='btn btn-sm btn-danger'> Update app! {send && <Spinner/>} </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {sendSuccess && <SuccessForm> {sendSuccess} </SuccessForm>}
                {sendError && <ErrorForm> {errors.serveError} </ErrorForm>}
            </div>
        )
    }
}