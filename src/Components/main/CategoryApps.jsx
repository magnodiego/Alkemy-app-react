import React from 'react';
import Axios from 'axios';
import AppCard from './AppCard';

export default class CategoryApps extends React.Component {
    constructor(props){
        super(props)

        this.state = {
            category: '',
            applications: [],
            noApps: ''
        }
    }

    componentDidMount(){
        this.setState({category: localStorage.getItem('category')})

        Axios.get(
            `http://localhost:8080/api/main/apps/category?category=["${localStorage.getItem('category')}"]`
        ).then((res)=>{
            if( res.data.toString() === ''){
                this.setState({noApps: true})
            } else {
                this.setState({
                    noApps: false,
                    applications: res.data.map(element => { return element}).map(element => { return element })
                })
            }
        })
    }

    render(){
        const { category } = this.state;
        const { applications } = this.state;
        const { noApps } = this.state;

        return(
            <div>
                <div className="jumbotron jumbotron-fluid">
                    <div className="container">
                        <h1 className="display-3"> {category} Apps!</h1>
                        <p className="lead">Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam, quis.</p>
                    </div>
                </div>
                <div className={ noApps ? 'container-fluid ' : 'd-none' }>
                    <div className="container">
                        <h3 className="display-5"> No apps to show =(</h3>
                    </div>
                </div>
                <div className={ noApps ? 'd-none' : 'mb-5'}>
                    <div className="container" >
                        <h2 className='mb-4 mt-5'>  </h2>
                    </div>
                    <div className="album py-5 bg-light">   
                        <div className='container'>
                            <div className="row">
                                <div className="card-group">
                                    {applications && applications.map( (element, index) =>  <AppCard apps={ element } index={index} key={ index }/>  )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    
}