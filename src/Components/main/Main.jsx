import React from 'react';
import Axios from 'axios';
import AppCard from './AppCard';

export default class Main extends React.Component {
    constructor(props){
        super(props)
        this.state = {
            newApp : false
        }

        this.addNewApp = this.addNewApp.bind(this);
    }

    componentDidMount(){

        // Get categories

        Axios.get(
            'http://localhost:8080/api/main/categories'
        ).then((res)=>{
            this.setState({
                categories: res.data.map(element => { return element.category })
            })
        }).catch((err)=>{
            this.setState({
                connectionError: `Can't connect to server, please try again.`
            })
        })

        // Get apps 
        
        const query1 = 'Social'
        const query2 = 'Games'
        const query3 = 'Finance'
        Axios.get(
            `http://localhost:8080/api/main/apps?category=["${query1}", "${query2}", "${query3}"]`
        ).then((res)=>{
            this.setState({
                query1: query1,
                query2: query2,
                query3: query3,
            })
            res.data.forEach((element, i) => {
                if(element === 'empty'){
                    this.setState({
                        [`query${i+1}Apps`]: ''
                    })
                }else{
                    this.setState({
                        [`query${i+1}Apps`]: res.data[i].map(element => { return element}).map(element => { return element }),
                    })
                }
            });
        }).catch((err)=>{
            this.setState({
                connectionError: `Can't connect to server, please try again.`
            })
        })
    }

    addNewApp = ()=>{
        this.setState(state => ({
            newApp: !state.newApp
        }));
    }

    render(){
        const { query1Apps } = this.state;
        const { query2Apps } = this.state;
        const { query3Apps } = this.state;
        const { query1 } = this.state;
        const { query2 } = this.state;
        const { query3 } = this.state;
        const { connectionError } = this.state;

        return(
            <div>
                <div className="jumbotron jumbotron-fluid">
                    <div className="container">
                        <h1 className="display-4">Apps to claps!</h1>
                        <p className="lead">Lorem ipsum dolor sit amet consectetur adipisicing elit. Numquam, quis.</p>
                    </div>
                </div>
                <div className='mb-5'>
                    <div className="container" >
                        {connectionError && <h2 className='mb-4 mt-5 text-center'> { connectionError } </h2>}
                        <h2 className='mb-4 mt-5'> {query1} </h2>
                    </div>
                    <div className={( query1Apps === '' ) ? 'container-fluid ' : 'd-none' }>
                        <div className="container">
                            <p className="lead"> No apps to show =(</p>
                        </div>
                    </div>
                    <div className='container'>
                        <div className="row">
                            <div className="col-md-12">
                                <div className='card-group h-50' >
                                    {query1Apps && query1Apps.map( (element, index) =>  <AppCard apps={ element } key={ index }/>  )}
                                </div>
                            </div>    
                        </div>
                    </div> 
                    <div className="container" >
                        <h2 className='mb-4 mt-5'> {query2}  </h2>
                    </div>
                    <div className={( query2Apps === '' ) ? 'container-fluid ' : 'd-none' }>
                        <div className="container">
                            <p className="lead"> No apps to show =(</p>
                        </div>
                    </div>
                    <div className='container'>
                        <div className="row">
                            <div className="col-md-12">
                                <div className='card-group h-50' >
                                    {query2Apps && query2Apps.map( (element, index) =>  <AppCard apps={ element } key={ index }/>  )}
                                </div>
                            </div>    
                        </div>
                    </div>
                    <div className="container" >
                        <h2 className='mb-4 mt-5'> {query3}  </h2>
                    </div>
                    <div className={( query3Apps === '' ) ? 'container-fluid ' : 'd-none' }>
                        <div className="container">
                            <p className="lead"> No apps to show =(</p>
                        </div>
                    </div>
                    <div className='container'>
                        <div className="row">
                            <div className="col-md-12">
                                <div className='card-group h-50' >
                                    {query3Apps && query3Apps.map( (element, index) =>  <AppCard apps={ element } key={ index }/>  )}
                                </div>
                            </div>    
                        </div>
                    </div>
                </div>
                <div>
                    
                </div>
            </div>
        )
    }
}