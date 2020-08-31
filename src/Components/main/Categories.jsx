import React from 'react';
import { Link } from 'react-router-dom';
import Axios from 'axios';


const styles = {
    categories: {
        textTransform: 'capitalize'
    },
    superior: {
        zIndex: '1'
    }
}

export default class Categories extends React.Component {
    
    constructor(props){
        super(props)

        this.state = {
            categories: this.props.categories
        }
    }

    componentDidMount(){
        // Obtener cantidad de apps
        try {
            Axios.get(
                `http://localhost:8080/api/main/apps/category?category=["All"]`
            ).then((res)=>{
                if( res.data.toString() === ''){
                    console.log('categorioes 0', res.data)
                } else {
                    console.log('categories', res.data)
                    res.data.map(element => {return element.category}).map( (element ) => {return console.log(element)})
                }
            })
        } catch (error) {
            this.setState({
                noApps: true
            })
        }
    }

    onClick = ()=>{
        this.props.handleClick()
    }

    saveCategory = ({target})=>{
       localStorage.setItem('category',(target.name))
    }

    render(){
        const { categories } = this.state;

        return(
            <div className="list-group position-absolute ml-2" style={styles.superior} onMouseLeave={this.onClick}>
                {categories.sort().map(element => <Link to={{pathname: `/main/${element}/apps`, aboutProps:{category: element}}} onClick={this.saveCategory} className="list-group-item list-group-item-action" style={styles.categories} name={element} key={element}>
                        {element}
                    </Link>)}
            </div>

        )
    }

}