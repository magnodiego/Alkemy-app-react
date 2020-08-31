import React from 'react';
import Axios from 'axios';
import ErrorInput from '../login-register/ErrorInput';
import SuccessForm from '../login-register/SuccessForm'
import InfoInput from '../login-register/InfoInput';
import ErrorForm from '../login-register/ErrorForm';
import Spinner from '../login-register/Spinner';

const validate = values => {
    const errors = {}
    if(!values.category ){
        errors.category = 'Select a category for your app.'
    }
    if(!values.appName || values.appName.length > 30 ){
        errors.appName = 'Enter your app name, it must be 30 characters long max'
    }
    if(!values.price || values.price < 0 || values.price.indexOf(',', 0) !== -1){
        errors.price = `Enter a valid price, if it's free, enter 0.`
    }
    if(!values.description || values.description > 120 ){
        errors.description = 'Enter your app description, it must be 120 characters long max.'
    }
    if(!values.imgName){
        errors.img = 'Select a photo for your app.'
    }
    return errors
}


export default class DeveloperRegisterApp extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            errors: {},
        }
        this.fileInput = React.createRef();
    }
    

    componentDidMount(){
        const user = JSON.parse(localStorage.getItem('user'))
        this.setState({user: user})
        
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

    handleChange = ({target})=>{
        const{ name, value } = target
        if( name !== 'img'){
            this.setState({ [name]: value })
        }else{
            this.setState({ imgName: this.fileInput.current.files[0].name })
            this.setState({ img: this.fileInput.current.files[0]})
        }
    }

    handleSubmit = (e)=>{
        e.preventDefault();
        this.setState({sendError: false})
        this.setState({sendSuccess: false})

        const { errors, img, ...stateValues} = this.state;
        const result = validate(stateValues);
        this.setState({ errors: result });
        
        if(!Object.keys(result).length){
            this.setState({send: true});
            const today = Date.now()

            let bodyFormData = new FormData()
            bodyFormData.append('userHash', this.state.user.hash)
            bodyFormData.append('category', stateValues.category)
            bodyFormData.append('appName', stateValues.appName)
            bodyFormData.append('price', stateValues.price)
            bodyFormData.append('description', stateValues.description)
            bodyFormData.append('img',  this.fileInput.current.files[0])
            bodyFormData.append('date',  today.toString())        

            Axios.post(
                'http://localhost:8080/api/main/developer/app',
                bodyFormData
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
                                serveError: 'The app name is already taken, please select another one.'
                            }
                        })
                        break;
                    case 500:
                        this.setState({sendError: true})
                        this.setState({
                            errors:{
                                serveError: 'The file format is not permitted.'
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
        const { categories } = this.state;

        return(
            
            <div className="p-5 mx-auto">
                {sendSuccess && <SuccessForm> The app has been created! </SuccessForm>}
                {sendError && <ErrorForm> {errors.serveError} </ErrorForm>}
                <div className=" shadow-lg p-5 mb-5 bg-white rounded" >
                    <div className='mb-4 center'>
                        <h4 className='userRegister'>Add an app</h4>
                    </div>
                    <form method='POST' onSubmit={this.handleSubmit} noValidate encType="multipart/form-data">
                       
                        <div className="form-group">
                            <label htmlFor="category">Category</label>
                            <select className={`form-control ${!errors.category ? '' : 'is-invalid' }`} name='category' required onChange={this.handleChange}>
                                <option></option>
                                {categories && categories.sort().map(element => element === 'All' ? '' : <option key={element}>{element}</option> )}
                            </select>
                            {errors.category && <ErrorInput>{errors.category}</ErrorInput>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="price" >Price</label>
                            <input type="number" name='price' className={`form-control ${!errors.price ? '' : 'is-invalid' }`} placeholder='0.00' required onChange={this.handleChange}/>
                            {errors.price && <ErrorInput>{errors.price}</ErrorInput>}
                        </div>       
                        <div className="form-group">
                            <label htmlFor="appName"> App name </label>
                            <input type="text" name='appName' className={`form-control ${!errors.appName ? '' : 'is-invalid' }`} required onChange={this.handleChange}/>
                            {errors.appName && <ErrorInput>{errors.appName}</ErrorInput>}
                            {!errors.appName && <InfoInput>{'The app name must be 30 characters long max.'}</InfoInput>}
                        </div>  
                        <div className="form-group">
                            <label htmlFor="description"> Description </label>
                            <textarea name='description' className={`form-control ${!errors.description ? '' : 'is-invalid' }`} required onChange={this.handleChange}/>
                            {errors.description && <ErrorInput>{errors.description}</ErrorInput>}
                            {!errors.description && <InfoInput>{'Give a short description about you app. You have 120 characteres top.'}</InfoInput>}
                        </div>
                        <div className="custom-file">
                            <input type="file" name='img' className={`custom-file-input ${!errors.img ? '' : 'is-invalid' }`} required onChange={this.handleChange} ref={this.fileInput}/>
                            <label className='custom-file-label' htmlFor="img"> Photo time! </label>
                            {errors.img && <ErrorInput>{errors.img}</ErrorInput>}
                            {!errors.img && <InfoInput>{'File format could be .png / .jpg / .jpeg.'}</InfoInput>}

                        </div>
                        <div className="center">
                            <button type="submit" className="btn btn-success mt-4 center"> Send your app!  {send && <Spinner/>} </button>
                            
                        </div> 
                    </form>
                </div>
            </div>
            
        )
    }
}